const LINE_FEED_REGEX = /(\n?[^\n]+\n?)/g;
const AMPERSAND_REGEX = /&/g;
const STYLE_TEMPLATE_REGEX = /StyleTemplate\[[\w]+\]/;
let id: number = 0;

/**
 * Transform a lyl style block to CSS
 *
 * Allowed blocks:
 *
 * // Simple
 * const BUTTON_STYLE = lyl `{
 *   padding: 8px 12px
 *   font-size: 14px
 *   border-radius: 9px
 *   border: 1px solid #e0e0e0
 * }`
 *
 * // Nesting
 * const style = lyl `{
 *   ul > {
 *     li {
 *       list-style-type: none;
 *     }
 *   }
 *   p {
 *     ~ {
 *       span {
 *         opacity: 0.8;
 *       }
 *     }
 *   }
 * }`
 *
 */
export class LylParse {

  constructor(
    private _template: string,
    private _className: string = '${className}'
  ) { }

  toCss() {
    const selectors: (string[])[] = [];
    let selector: null | string = null;
    const rules = new Map<string, string>();
    this._template.replace(LINE_FEED_REGEX, (_ex, fullLine: string) => {
      fullLine = fullLine.trim();

      if (fullLine.endsWith('{')) {
        if (selectors.length === 0) {
          selectors.push([this._className]);
          selector = selectors[0][0];
        } else {
          selectors.push(
            fullLine.slice(0, fullLine.length - 1)
            .trim()
            .split(',')
            .map(_ => _.trim())
          );
          selector = this._resolveSelectors(selectors);
        }
        if (!rules.has(selector)) {
          rules.set(selector, '');
        }
      } else if (fullLine.length === 1 && fullLine.endsWith('}')) {
        selectors.pop();
        if (selectors.length) {
          selector = this._resolveSelectors(selectors);
          if (!rules.has(selector)) {
            rules.set(selector, '');
          }
        }
      } else if (fullLine.startsWith('...')) {
        const lin = fullLine.slice(3);
        if (lin.startsWith('/* >> ds')) {
          // Ignore compiled css
          rules.set(createUniqueCommentSelector('ds'), lin);
          fullLine = lin;
        } /** For non LylModule< */else {
          fullLine = `\${(${lin.slice(2, lin.length - 1)})(\`${selector}\`)}`;
          rules.set(createUniqueCommentSelector('ds'), fullLine);
        } /** for non LylModule>  */
      } else {
        if (fullLine.includes(':') && !fullLine.endsWith(';')) {
          fullLine += ';';
        }
        rules.set(selector!, rules.get(selector!)! + fullLine);
      }
      return '';
    });

    return Array.from(rules.entries())
      .filter(rule => rule[1])
      .map(rule => {
        const sel = rule[0];
        // For non LylModule<
        // others type of style
        // console.log(rule, sel);

        if (sel.startsWith('/* >> ds')) {
          return `${sel}${rule[1]}`;
        }
        // for non LylModule>

        if (sel.startsWith('@')) {
          return `${sel}{${rule[1]}}}`;
        }
        return `${sel}{${rule[1]}}`;
      }).join('');

  }

  private _resolveSelectors(selectors: (string[])[]) {
    let media: string | null = null;
    const sel = selectors
      .map(_ => _.filter(__ => {
        if (__.startsWith('@')) {
          // save media
          media = __;
          return false;
        }
        return __;
      }))
      .filter(_ => _.length)
      .reduce((prev, current) => {
        const result = prev.map(item => current.map(cu => {
          if (cu.includes('&')) {
            return cu.replace(AMPERSAND_REGEX, item);
          }
          return `${item} ${cu}`;
        }));
        return Array.prototype.concat.apply([], result);
      })
      .join(',');

    if (media) {
      return `${media}{${sel}`;
    }
    return sel;
  }

}

export type StyleTemplate = (className: string) => string;

export function lyl(literals: TemplateStringsArray, ...placeholders: (string | number | StyleTemplate)[]) {

  return (className: string) => {
    let result = '';
    const dsMap = new Map<string, StyleTemplate>();
    for (let i = 0; i < placeholders.length; i++) {
      const placeholder = placeholders[i];
      result += literals[i];
      if (typeof placeholder === 'function' && result.endsWith('...')) {

        const newID = createUniqueId();
        dsMap.set(newID, placeholder);
        result += newID;
      } else {
        result += placeholder;
      }
    }

    // add the last literal
    result += literals[literals.length - 1];
    const css = result.replace(STYLE_TEMPLATE_REGEX, (str) => {
      if (dsMap.has(str)) {
        return `${createUniqueCommentSelector('ds')}${dsMap.get(str)!(className)}`;
      }
      return str;
    });
    return new LylParse(css, className).toCss();
  };
}

function createUniqueId() {
  return `StyleTemplate[__${(id++).toString(36)}]`;
}

function createUniqueCommentSelector(text = 'id') {
  return `/* >> ${text} -- ${Math.floor(new Date().valueOf() * Math.random()).toString(36)} */`;
}
