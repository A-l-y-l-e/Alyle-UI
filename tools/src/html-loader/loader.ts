import * as showdown from 'showdown';
import { prism } from './prism';
import { prismCustomClass } from './prism-custom-class';

const markedOptions = {
  langPrefix: 'lang-',
};

showdown.extension('prism', () => {
  // use new shodown's regexp engine to conditionally parse codeblocks
  const replacement = (_wholeMatch: string, match: string, left: string, right: string) => {
    if (left.includes('prsm')) {
      return left + match + right;
    }
    const lang: string | null = (left.match(/class=\"([^ \"]+)/) || [])[1];
    // unescape match to prevent double escaping
    match = htmlunencode(match);

    if (lang) {
      match = highlight(match, lang);
    }

    return match ;
  };
  return [
    {
      type: 'output',
      filter: text => {
        return showdown.helper.replaceRecursiveRegExp(text, replacement, '<pre><code\\b[^>]*>', '</code></pre>', 'g');
      }
    },
    {
      type: 'output',
      filter: text => {
        return showdown.helper.replaceRecursiveRegExp(text, replacement, '<code\\b[^>]*>', '</code>', 'g');
      }
    }
  ];
});

export default function (markdown) {

  this.cacheable();

  const converter = new showdown.Converter({
    extensions: ['prism']
  });

  const html = converter.makeHtml(markdown);

  return html;
}

/**
 * Convert code to highlighted HTML
 * @param code code for render
 * @param infostring language
 * @param escaped if is escaped
 */
export function highlight(code: string, lang: string | null, inline = false): string {
  const classes = prismCustomClass();
  code = escape(lang ? prism.highlight(code, prism.languages[lang], lang) : code);
  let result = `<div class="${classes.root}"><pre class="${classes.pre}">`
    + code
    + '</pre></div>';
  if (inline) {
    result = `<code class="${classes.code}">${result}</code>`;
  }
  return result;
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
