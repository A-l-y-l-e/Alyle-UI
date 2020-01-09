import { Color } from '@alyle/ui/color';

const LINE_FEED_REGEX = () => /(\n?[^\n]+\n?)/g;
const AMPERSAND_REGEX = () => /&/g;
const STYLE_TEMPLATE_REGEX = () => /StyleTemplate\[[\w]+\]/g;
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
    const rules = new Map<string, string[]>();
    this._template
      .replace(/(\/\/\s[^\n\r]*(?:[\n\r]+|$))/g, '')
      .replace(/,\n/g, ',')
      .replace(LINE_FEED_REGEX(), (_ex, fullLine: string) => {
      fullLine = fullLine.trim();

      if (fullLine.endsWith('{')) {
        if (selectors.length === 0) {
          selectors.push([this._className]);
          selector = selectors[0][0];
        } else {
          const line_1 = fullLine.slice(0, fullLine.length - 1).trim();
          const isMediaQuery = line_1.includes('@');
          if (isMediaQuery) {
            selectors.push(
              [line_1.trim()]
            );
            if (!rules.has(line_1)) {
              rules.set(line_1, []);
            }
          } else {
            selectors.push(
              line_1
              .split(',')
              .map(_ => _.trim())
            );
          }
          selector = this._resolveSelectors(selectors);

        }


        if (!rules.has(selector)) {
          rules.set(selector, []);
        }
      } else if (fullLine.length === 1 && fullLine.endsWith('}')) {
        selectors.pop();
        if (selectors.length) {
          selector = this._resolveSelectors(selectors);
          if (!rules.has(selector)) {
            rules.set(selector, []);
          }
        }
      } else if (fullLine.startsWith('/* >> ds')) {
        selector = this._resolveSelectors(selectors);
        const lin = fullLine;

        // Ignore compiled css
        rules.get(selector)!.push(lin);
        // fullLine = lin;
        // /** For non LylModule< */else {
        //   fullLine = `\${(${lin.slice(2, lin.length - 1)})(\`${selector}\`)}`;
        //   rules.set(createUniqueCommentSelector('ds'), fullLine);
        // } /** for non LylModule>  */
      } else if (fullLine.startsWith('...')) {
        // for non LylModule>
        const content = fullLine.slice(3);
        selector = this._resolveSelectors(selectors);
        // Ignore compiled css
        rules.get(selector)!.push(`${createUniqueCommentSelector('cc')}${content}`);
      } else {
        if (fullLine) {
          if (fullLine.includes('undefined') || fullLine.startsWith('// ')) {
            return '';
          }
          if (fullLine.endsWith(';')) {
            throw new Error(`Do not require semicolon in [${fullLine}]`);
          }
          if (fullLine.includes(': ')) {
            fullLine = fullLine.replace(': ', ':');
          }
          fullLine += ';';
          rules.get(selector!)!.push(fullLine);
        }
      }
      return '';
    });

    // Join media queries & keyframes
    rules.forEach((val, key) => {
      const matchArray = key.match(/(@[^\${]*(?:\${[^{]*)*){/);
      if (matchArray) {
        const media = matchArray[1];
        if (media !== key && val.length) {
          const after = rules.get(media)!;
          const sel = key.replace(media + '{', '');
          const newValue = after + val.reduce((previous, current) => {

            const last = previous[previous.length - 1];

            if (current.startsWith('/* >> ds')) {
              previous.push(current.replace(/\|\|\&\|\|/g, sel));
            } else if (current.startsWith('/* >> cc')) {
              previous.push(transformCC(current, sel));
            } else {
              if (Array.isArray(last)) {
                last.push(current);
              } else {
                previous.push([current]);
              }
            }
            return previous;
          }, [] as (string | string[])[])
            .map(item => Array.isArray(item) ? `${sel}{${item.join('')}}` : item).join('');
          // const newValue = after
          // + sel
          // + `{${val.join('')}}`;
          rules.set(media, [newValue]);
          rules.delete(key);
        }
      }
    });

    return Array.from(rules.entries())
      .filter(rule => rule[1])
      .map(rule => {
        const sel = rule[0];
        const contents = rule[1];
        const css: string[] = [];
        const contentRendered: string[] = [];
        const set = new Set<string[]>();

        for (let index = 0; index < contents.length; index++) {
          const content = contents[index];
          if (content) {
            if (content.startsWith('/* >> ds')) {
              contentRendered.push(content.replace(/\|\|\&\|\|/g, sel));
              set.add(contentRendered);
            } else if (content.startsWith('/* >> cc')) {
              contentRendered.push(transformCC(content, sel));
              set.add(contentRendered);
            } else {
              // css += `${sel}{${content}}`;
              css.push(content);
              set.add(css);
            }
          }
        }
        return Array.from(set).map((_) => {
          if (_ === css) {
            return css.length
            ? `${sel}{${css.join('')}}`
            : '';
          } else {
            return _.join('');
          }
        }).join('');
        // return (css
        //   ? `${sel}{${css}}`
        //   :  '') + contentRendered;
        // if (content.startsWith('/* >> ds')) {
        //   return content.replace(/\|\|\&\|\|/g, sel);
        // }
        // if (content.startsWith('/* >> cc')) {
        //   content = content.replace(/\/\* >> cc[^\/\*]+\*\//g, '');
        //   let variable = content.slice(2, content.length - 1);
        //   variable = `st2c((${variable}), \`${sel}\`)`;
        //   return `\${${variable}}`;
        // }
        // // for non LylModule>

        // if (sel.startsWith('@')) {
        //   return `${sel}{${rule[1]}}`;
        // }
        // return `${sel}{${content}}`;
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
            return cu.replace(AMPERSAND_REGEX(), item);
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

function transformCC(content: string, sel: string) {
  content = content.replace(/\/\* >> cc[^\/\*]+\*\//g, '');
  let expression = content.slice(2, content.length - 1);
  expression = `st2c((${expression}), \`${sel}\`)`;
  return `\${${expression}}`;
}

export type StyleTemplate = (className: string) => string;

export function lyl(literals: TemplateStringsArray, ...placeholders: (string | Color | StyleCollection | number | StyleTemplate | null | undefined)[]) {
  return (className: string) => {
    let result = '';
    const dsMap = new Map<string, (StyleTemplate) | StyleCollection>();
    for (let i = 0; i < placeholders.length; i++) {
      const placeholder = placeholders[i];
      result += literals[i];
      if (result.endsWith('...')) {
        result = result.slice(0, result.length - 3);
        if (typeof placeholder === 'function'
          || placeholder instanceof StyleCollection
        ) {
          const newID = createUniqueId();
          dsMap.set(newID, placeholder);
          result += newID;
        }
      } else {
        result += placeholder;
      }
    }

    // add the last literal
    result += literals[literals.length - 1];
    const css = result.replace(STYLE_TEMPLATE_REGEX(), (str) => {
      if (dsMap.has(str)) {
        const fn = dsMap.get(str)!;
        return `${createUniqueCommentSelector('ds')}${st2c(fn, '||&||')}`;
      }
      return '';
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

type Transformer<T> = (st: T) => (StyleTemplate);

export class StyleCollection<T = any> {
  private _templates: (StyleTemplate | T)[];
  private _transformer?: Transformer<T>;

  constructor(...templates: (T)[])
  constructor(...templates: (StyleTemplate | T)[]) {
    this._templates = templates;
    this.css = this.css.bind(this);
  }

  add(...templates: (T)[]): StyleCollection<T>;
  add(...templates: (StyleTemplate | T)[]): StyleCollection;
  add(...templates: (StyleTemplate | T)[]): StyleCollection | StyleCollection<T> {
    // return new StyleCollection(...[...this._templates, ...templates]);
    this._templates.push(...templates);
    return this;
  }

  /** Transform style */
  setTransformer(transformer: Transformer<T>) {
    this._transformer = transformer;
    return this;
  }

  /**
   * @return StyleTemplate
   * @docs-private
   */
  css(className: string) {
    let lin = '';
    const templates = this._templates;
    for (let index = 0; index < templates.length; index++) {
      let template: StyleTemplate;
      if (this._transformer) {
        template = ((this._transformer(templates[index] as T)));
      } else {
        template = (templates[index] as StyleTemplate);
      }
      lin += template(className);
    }
    return lin;
  }

}

/**
 * Transform a ...{style} to css
 * For internal use purposes only
 * @param fn StyleTemplate or StyleCollection
 * @param className class name
 */
export function st2c(
  fn: StyleTemplate | StyleCollection | null | undefined,
  className: string) {
  if (fn == null) {
    return '';
  }
  if (fn instanceof StyleCollection) {
    return fn.css(className);
  }
  return fn(className);
}

// export function normalizeStyleTemplate(
//   fn: StyleTemplate
//   ) {
//   if (fn.length) {
//     return fn as StyleTemplate;
//   } else {
//     return (fn as (() => StyleTemplate))();
//   }
// }

export class StringIdGenerator {
  private _chars: string;
  private _nextId: number[];
  constructor(chars = 'abcdefghijklmnopqrstuvwxyz') {
    this._chars = chars;
    this._nextId = [0];
  }

  next() {
    const r: string[] = [];
    for (const char of this._nextId) {
      r.unshift(this._chars[char]);
    }
    this._increment();
    return r.join('');
  }

  _increment() {
    for (let i = 0; i < this._nextId.length; i++) {
      const val = ++this._nextId[i];
      if (val >= this._chars.length) {
        this._nextId[i] = 0;
      } else {
        return;
      }
    }
    this._nextId.push(0);
  }
}
