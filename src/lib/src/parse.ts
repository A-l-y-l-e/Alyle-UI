const LINE_FEED_REGEX = /(\n?[^\n]+\n?)/g;
const AMPERSAND_REGEX = /&/g;

export class LylParse {

  constructor(
    private _template: string
  ) { }

  toCss() {
    const selectors: (string[])[] = [];
    let selector: null | string = null;
    const rules = new Map<string, string>();
    this._template.replace(LINE_FEED_REGEX, (_ex, fullLine: string) => {
      fullLine = fullLine.trim();
      if (fullLine.endsWith('{')) {
        if (selectors.length === 0) {
          selectors.push(['${className}']);
          selector = selectors[0][0];
        } else {
          selectors.push(fullLine.slice(0, fullLine.length - 1).split(',').map(_ => _.trim()));
          selector = this._resolveSelectors(selectors);
        }
        if (!rules.has(selector)) {
          rules.set(selector, '');
        }
      } else if (fullLine.endsWith('}')) {
        selectors.pop();
        if (selectors.length) {
          selector = this._resolveSelectors(selectors);
          if (!rules.has(selector)) {
            rules.set(selector, '');
          }
        }
      } else {
        rules.set(selector!, rules.get(selector!)! + fullLine);
      }
      return '';
    });

    return `(className: string) => \`${Array.from(rules.entries()).filter(rule => rule[1]).map(rule => `${rule[0]}{${rule[1]}}`).join('')}\``;
  }

  private _resolveSelectors(selectors: (string[])[]) {

    return selectors.reduce((prev, current) => {
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
