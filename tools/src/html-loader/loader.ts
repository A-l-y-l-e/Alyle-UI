import * as showdown from 'showdown';
import { prism } from './prism';
import { prismCustomClass } from './prism-custom-class';

showdown.extension('prism', () => {
  // use new shodown's regexp engine to conditionally parse codeblocks
  const replacement = (_wholeMatch: string, match: string, left: string, right: string) => {

    // Ignored already rendered
    if (left.includes('prsm')) {
      return _wholeMatch;
    }
    const lang: string | null = (left.match(/class=\"([^ \"]+)/) || [])[1];

    // unescape match to prevent double escaping
    match = htmlunencode(match);

    return highlight(match, lang, right === '</code>');

  };
  return [
    {
      type: 'output',
      filter: text => {
        let result = showdown.helper.replaceRecursiveRegExp(text, replacement, '<pre><code\\b[^>]*>', '</code></pre>', 'g');
        result = showdown.helper.replaceRecursiveRegExp(result, replacement, '<code\\b[^>]*>', '</code>', 'g');
        return result;
      }
    }
  ];
});

export default function (markdown: string) {
  this.cacheable();

  const converter = new showdown.Converter({
    extensions: ['prism']
  });

  const html = converter.makeHtml(markdown);

  return html;
}

/**
 * Convert code to highlighted HTML
 */
export function highlight(code: string, lang: string | null, inline?: boolean): string {
  const classes = prismCustomClass();
  code = escape((lang && prism.languages[lang])
    ? prism.highlight(code, prism.languages[lang], lang)
    : htmlEncode(code));
  if (inline) {
    // Preserve white spaces
    code = code.replace(/<\/span> <span/g, '</span>&nbsp;<span');
    return `<code prsm class="${[classes.code, classes.inline].join(' ')}">${code}</code>`;
  }
  return `<pre class="${classes.pre}"><code prsm class="${classes.code}">`
    + code
    + '</code></pre>';
}

/**
 * Escape `{}`
 * @param html
 */
function escape(html: string) {
  const escapeTest = /[{}]/;
  const escapeReplace = /[{}]/g;
  const replacements = {
    '{': '&#123;',
    '}': '&#125;'
  };

  if (escapeTest.test(html)) {
    return html.replace(escapeReplace, (ch: '{' | '}') => replacements[ch]);
  }

  return html;
}

function htmlunencode(text: string) {
  return (
    text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
  );
}
function htmlEncode(text: string) {
  return (
    text
      .replace(/\&/g, '&amp;')
      .replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;')
  );
}
