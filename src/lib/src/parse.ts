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
    const rules = new Map<string, string>();
    this._template.replace(LINE_FEED_REGEX(), (_ex, fullLine: string) => {
      fullLine = fullLine.trim();

      if (fullLine.endsWith('{')) {
        if (selectors.length === 0) {
          selectors.push([this._className]);
          selector = selectors[0][0];
        } else {
          const line_1 = fullLine.slice(0, fullLine.length - 1).trim();
          selectors.push(
            line_1
            .split(',')
            .map(_ => _.trim())
          );
          selector = this._resolveSelectors(selectors);

          if (line_1.includes('@')) {
            if (!rules.has(line_1)) {
              rules.set(line_1, '');
            }
          }
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
      } else if (fullLine.startsWith('/* >> ds')) {
        selector = this._resolveSelectors(selectors);
        const lin = fullLine;
        // Ignore compiled css
        rules.set(`${createUniqueCommentSelector('compiled')}${selector}`, lin);
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
        rules.set(`${createUniqueCommentSelector('cc')}${selector}`, content);
      } else {
        if (fullLine) {
          if (fullLine.includes('undefined')) {
            return '';
          }
          if (fullLine.endsWith(';')) {
            throw new Error(`Do not require semicolon in [${fullLine}]`);
          }
          if (fullLine.includes(': ')) {
            fullLine = fullLine.replace(': ', ':');
          }
          fullLine += ';';
          rules.set(selector!, rules.get(selector!)! + fullLine);
        }
      }
      return '';
    });

    // Join media queries & keyframes
    rules.forEach((val, key) => {
      const matchArray = key.match(/(@[^\${]*(?:\${[^{]*)*){/);
      if (matchArray) {
        const media = matchArray[1];
        if (media !== key && val) {
          const after = rules.get(media)!;
          const newValue = after + key.replace(media + '{', '') + `{${val}}`;
          rules.set(media, newValue);
          rules.delete(key);
        }
      }
    });

    return Array.from(rules.entries())
      .filter(rule => rule[1])
      .map(rule => {
        const sel = rule[0];
        const content = rule[1];

        if (content.startsWith('/* >> ds')) {
          return content.replace(/\|\|\&\|\|/g, sel);
        }
        if (sel.startsWith('/* >> cc')) {
          let variable = content.slice(2, content.length - 1);
          variable = `styleTemplateToString((${variable}), \`${sel}\`)`
            .replace(/\/\* >> cc[^\/\*]+\*\//g, '') ;
          return `\${${variable}}`;
        }
        // for non LylModule>

        if (sel.startsWith('@')) {
          return `${sel}{${rule[1]}}`;
        }
        return `${sel}{${content}}`;
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
        if (typeof placeholder === 'function' || placeholder instanceof StyleCollection) {
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
        let template: StyleTemplate;
        if (fn instanceof StyleCollection) {
          template = fn.css;
        } else {
          template = fn;
        }
        return `${createUniqueCommentSelector('ds')}${template('||&||')}`;
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
 * Simple object check.
 * @param item
 */
function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item)) && !(item instanceof StyleCollection);
}

export function mergeThemes<T, U>(target: T, source: U): T & U;
export function mergeThemes<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function mergeThemes<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function mergeThemes(target: object, ...sources: any[]): any;
export function mergeThemes(target: any, ...sources: any[]): any {
  if (!sources.length) { return target; }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          if (source[key].constructor.name === 'Object') {
            target[key] = {};
          } else {
            // if is a class
            target[key] = source[key];
          }
        }
        mergeThemes(target[key], source[key]);
      } else {
        const targetKey = target[key];
        const sourceKey = source[key];
        // Merge styles
        if (targetKey instanceof StyleCollection && typeof sourceKey === 'function') {
          target[key] = (target[key] as StyleCollection).add(sourceKey);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  return mergeThemes(target, ...sources);
}

export function styleTemplateToString(fn: StyleTemplate | StyleCollection | null | undefined, className: string) {
  if (fn instanceof StyleCollection) {
    return fn.css(className);
  }
  return fn ? (fn)(className) : '';
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
