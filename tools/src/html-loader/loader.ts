import * as marked from 'marked';
import { prism } from './prism';
import { prismCustomClass } from './prism-custom-class';

const markedOptions = {
  langPrefix: 'lang-',
};

export default function(markdown: string) {

  this.cacheable();

  const options = markedOptions;

  marked.setOptions(options);

  const renderer = new marked.Renderer();

  const classes = prismCustomClass();
  renderer.code = highlight;

  renderer.codespan = function(text) {
    return `<code class="${classes.code}">${text}</code>`;
  };

  const html = marked(markdown, { renderer });

  return html;
}

/**
 * Convert code to highlighted HTML
 * @param code code for render
 * @param infostring language
 * @param escaped if is escaped
 */
export function highlight(code: string, infostring: string, escaped = false): string {
  const classes = prismCustomClass();
  const lang = (infostring || '').match(/\S*/)![0];
  if (!lang) {
    return `<div class="${classes.root}">`
      + `<pre class="${classes.pre}">`
      + escape(escaped ? code : (code))
      + '</pre></div>';
  }
  return '<div class="'
    + [(this.options || markedOptions).langPrefix + lang, classes.root].join(' ')
    + '">'
    + `<pre class="${classes.pre}">`
    + escape(prism.highlight(escaped ? code : (code), prism.languages[lang], lang))
    + '</pre></div>\n';
}

function escape(html: string) {
  // const escapeTest = /[&<>"'{}]/;
  // const escapeReplace = /[&<>"'{}]/g;
  const escapeTest = /[{}]/;
  const escapeReplace = /[{}]/g;
  const replacements = {
    // '&': '&amp;',
    // '<': '&lt;',
    // '>': '&gt;',
    // '"': '&quot;',
    // '\'': '&#39;',
    '{': '&#123;',
    '}': '&#125;'
  };

  if (escapeTest.test(html)) {
    return html.replace(escapeReplace, (ch: '{' | '}') => replacements[ch]);
  }

  return html;
}
