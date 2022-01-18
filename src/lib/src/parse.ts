import { Color } from '@alyle/ui/color';

const LINE_FEED_REGEX = () => /[\n\s]*([^\n]+)/g;
const AMPERSAND_REGEX = () => /&/g;

enum RuleType {
  FontFace,
  MediaQuery,
  KeyFrame,
  Style,
  DynamicStyle,
  CompiledStyle
}

interface Rule {
  selector: string;
  block: string;
  type: RuleType;
  hasMedia?: boolean;
  isEmpty: boolean;
  isReady?: boolean;
}

type Selectors = string[] | string;

/**
 * Transform a lyl style block to CSS
 */
export class LylParse {

  constructor(
    private _template: string,
    private _className: string = '${className}',
    private _isServer: boolean,
    /** Is true when used inside lyl */
    private _isDevMode: boolean
  ) { }

  toCss() {
    const selectors: Selectors[] = [];
    const resolvedSelectors: Rule[] = [];
    const rules: Rule[] = [];
    this._template
      .replace(/(\/\/\s[^\n\r]*(?:[\n\r]+|$))/g, '') // remove comments
      .replace(/,[\n\s]+/g, ',')
      .replace(LINE_FEED_REGEX(), (_ex, fullLine: string) => {

      if (fullLine.endsWith('{')) {
        if (selectors.length === 0) {
          selectors.push([this._className]);
          this._createRule(rules, RuleType.Style, selectors, resolvedSelectors);
        } else {
          const line_1 = fullLine.slice(0, fullLine.length - 1).trim();
          if (line_1 === '@font-face') {
            selectors.push(
              line_1
            );
            this._createRule(rules, RuleType.FontFace, selectors, resolvedSelectors);
          } else if (line_1.startsWith('@m')) {
            selectors.push(
              line_1
            );
            this._createRule(rules, RuleType.MediaQuery, selectors, resolvedSelectors);

          } else if (line_1.startsWith('@k')) {
            selectors.push(
              line_1
            );
            this._createRule(rules, RuleType.KeyFrame, selectors, resolvedSelectors);
          } else {
            selectors.push(
              line_1
              .split(',')
              .map(_ => _.trim())
              );
            this._createRule(rules, RuleType.Style, selectors, resolvedSelectors);
          }

        }


      } else if (fullLine.length === 1 && fullLine === '}') {
        this._removeParentSelector(rules, selectors, resolvedSelectors);
      } else if (this._isDevMode && fullLine.startsWith('/* >> ds')) {
        const lin = fullLine;

        this._createRuleWithResolvedSelector(rules, RuleType.DynamicStyle, selectors, resolvedSelectors, lin);
      } else if (this._isServer && fullLine.startsWith('...')) {
        const content = fullLine.slice(3);

        this._createRuleWithResolvedSelector(rules, RuleType.CompiledStyle, selectors, resolvedSelectors, content);

      } else {
        if (fullLine) {
          if (this._isDevMode && fullLine.includes('undefined')) {
            return '';
          }
          if (this._isDevMode && fullLine.endsWith(';')) {
            throw new Error(`Do not require semicolon in [${fullLine}]`);
          }
          if (fullLine.includes(': ')) {
            fullLine = fullLine.replace(': ', ':');
          }
          fullLine += ';';
          this._appendDeclaration(rules, RuleType.Style, fullLine);
        }
      }
      return '';
    });


    return rules
      .filter(rule => !rule.isEmpty)
      .map(rule => {
        return rule.block;
      }).join('');

  }


  private _createRule(rules: Rule[], type: RuleType, selectors: Selectors[], resolvedSelectors: Rule[]) {
    const parentRule = resolvedSelectors[resolvedSelectors.length - 1] as (Rule | undefined);
    const prevRule = rules[rules.length - 1] as (Rule | undefined);

    if (prevRule && !prevRule.isReady) {
      prevRule.block += `}`;
      prevRule.isReady = true;
    }
    let selector = '';
    if (type === RuleType.FontFace) {
      selector = `@font-face`;
    } else if (type === RuleType.KeyFrame) {
      selector = selectors[1] as string;
    } else if (parentRule && parentRule.type === RuleType.KeyFrame) {
      selector = selectors[selectors.length - 1][0];
    } else if (type === RuleType.MediaQuery || (parentRule && parentRule.type === RuleType.MediaQuery && prevRule && prevRule.isEmpty)) {
      selector = resolveSelectors(selectors, false);
    } else {
      selector = resolveSelectors(selectors, true);
    }
    const rule: Rule = {
      selector,
      block: `${selector}{`,
      type: RuleType.Style,
      isEmpty: true
    };
    resolvedSelectors.push({selector: '', block: '', type: type, isEmpty: true});
    rules.push(rule);

    // If is new media query
    if (type === RuleType.MediaQuery) {
      // rule.block += `{`;
      rule.hasMedia = true;
    }
    if (parentRule && parentRule.hasMedia) {
      rule.hasMedia = true;
    }

    if (type === RuleType.KeyFrame) {
      rule.isReady = true;
      rule.isEmpty = false;
    }
    return rule;
  }

  private _createRuleWithResolvedSelector(
    rules: Rule[],
    type: RuleType,
    selectors: Selectors[],
    resolvedSelectors: Rule[],
    content: string
  ) {
    if (!content) {
      return;
    }

    const prevRule = rules[rules.length - 1];
    const parentRule = resolvedSelectors[resolvedSelectors.length - 1] as (Rule | undefined);
    const { hasMedia } = prevRule;
    let selector = '';
    if (type === RuleType.MediaQuery || (parentRule && parentRule.type === RuleType.MediaQuery && prevRule && prevRule.isEmpty)) {
      selector = resolveSelectors(selectors, false);
    } else {
      selector = resolveSelectors(selectors, true);
    }

    // Close previous
    if (prevRule && !prevRule.isReady) {
      prevRule.block += `}`;
    }

    const rule: Rule = {
      selector: selector,
      block: ``,
      type,
      hasMedia,
      isEmpty: false
    };
    if (type === RuleType.CompiledStyle) {
      rule.block = transformCC(content, selector);
    } else if (type === RuleType.DynamicStyle) {
      rule.block = content.replace(/\|\|\&\|\|/g, selector);
    }
    rule.isReady = true;
    rules.push(rule);
  }

  private _appendDeclaration(rules: Rule[], _type: RuleType, content: string) {
    if (!content) {
      return;
    }

    let prevRule = rules[rules.length - 1];
    if (prevRule && prevRule.isReady) {
      prevRule = {
        selector: prevRule.selector,
        block: `${prevRule.selector}{`,
        type: prevRule.type,
        hasMedia: prevRule.hasMedia,
        isEmpty: false
      };
      rules.push(prevRule);
    }
    prevRule.block += content;
    prevRule.isEmpty = false;

  }

  private _removeParentSelector(rules: Rule[], selectors: Selectors[], resolvedSelectors: Rule[]) {
    selectors.pop();
    const prevRule = rules[rules.length - 1] as (undefined | Rule);
    const currentRule = resolvedSelectors.pop();
    if (!prevRule) {
      return;
    }

    // Close previous rule
    if (!prevRule.isReady) {
      prevRule.block += `}`;
      prevRule.isReady = true;
    }
    if (
      currentRule && (currentRule.type === RuleType.MediaQuery || currentRule.type === RuleType.KeyFrame)
    ) {
      prevRule.block += `}`;
      prevRule.isReady = true;
    }
  }

}


function transformCC(content: string, sel: string) {
  content = content.replace(/\/\* >> cc[^\/\*]+\*\//g, '');
  let expression = content.slice(2, content.length - 1);
  expression = `st2c((${expression}), \`${sel}\`)`;
  return `\${${expression}}`;
}

export function resolveSelectors(selectors: Selectors[], ignoreMediaQuery?: boolean) {
  let media: string | null = null;
  const sel = selectors
    .filter((_): _ is string[] => {
      if (typeof _ === 'string') {
        if (!ignoreMediaQuery) {
          media = _;
        }
        return false;
      }
      return !!_.filter(__ => __).length;
    });

  const sel2 = sel.length === 1
    ? sel[0].join(',')
    : sel.length ? (sel.reduce((prv, curr) => {
    const result = prv.map(item => curr.map(cu => {
      if (cu.includes('&')) {
        return cu.replace(AMPERSAND_REGEX(), item);
      }
      return `${item} ${cu}`;
    }));
    return Array.prototype.concat.apply([], result) as string[];
  }) as string[]).join(',') : '';

  if (media) {
    return `${media}{${sel2}`;
  }
  return sel2;
}


export type StyleTemplate = (className: string) => string;

export function lyl(literals: TemplateStringsArray, ...placeholders: (string | Color | StyleCollection | number | StyleTemplate | null | undefined)[]) {
  return (className: string) => {
    let result = '';
    // Save expressions
    for (let i = 0; i < placeholders.length; i++) {
      const placeholder = placeholders[i];
      result += literals[i];
      if (result.endsWith('...')) {
        result = result.slice(0, result.length - 3);
        if (typeof placeholder === 'function'
          || placeholder instanceof StyleCollection
        ) {
          result += `${createUniqueCommentSelector('ds')}${st2c(placeholder, '||&||')}`;
        }
      } else {
        result += placeholder;
      }
    }

    // add the last literal
    result += literals[literals.length - 1];
    const css = new LylParse(result, className, false, true).toCss();
    return css;
  };
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

  private _increment() {
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
