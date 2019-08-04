const LINE_FEED_REGEX = /(\n?[^\n]+\n?)/g;
const AMPERSAND_REGEX = /&/g;

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
          selectors.push(fullLine.slice(0, fullLine.length - 1).trim().split(',').map(_ => _.trim()));
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
      } else
      /** For non LylModule< */
      if (fullLine.startsWith('...')) { // delete this in LylModule to skip this check, remove '...' in lyl `` Fn
        const lin = fullLine.slice(3);
        fullLine = `\${(${lin.slice(2, lin.length - 1)})(\`${selector}\`)}`;
        rules.set(`/* >>ds id: ${Math.floor(new Date().valueOf() * Math.random()).toString(36)} */`, fullLine);
      } else /** for non LylModule>  */ {
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

        if (sel.startsWith('/* >>')) {
          return `${sel}${rule[1]}`;
        }
        // for non LylModule>
        return `${sel}{${rule[1]}}`;
      }).join('');

  }

  private _resolveSelectors(selectors: (string[])[]) {
    console.log(selectors.map(_ => _.filter(__ => __)).filter(_ => _.length));
    return selectors.map(_ => _.filter(__ => __)).filter(_ => _.length).reduce((prev, current) => {
      const result = prev.map(item => current.map(cu => {
        if (cu.includes('&')) {
          return cu.replace(AMPERSAND_REGEX, item);
        }
        return `${item} ${cu}`;
      }));
      return Array.prototype.concat.apply([], result);
    }).join(',');
  }

}

export function lyl(_literals: TemplateStringsArray, ..._placeholders: any[]) {
  return '';
}
