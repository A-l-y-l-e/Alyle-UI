import * as marked from 'marked';
import { prism } from './prism';
import { prismCustomClass } from './prism-custom-class';

export default function (markdown: string) {

  this.cacheable();

  const options = {
    langPrefix: 'lang-',
  };

  marked.setOptions(options);

  const renderer = new marked.Renderer();

  renderer.code = function (code, infostring, escaped) {
    const classes = prismCustomClass();
    const lang = (infostring || '').match(/\S*/)![0];
    if (!lang) {
      return `<div class="${classes.root}">`
        + `<pre class="${classes.pre}">`
        + escape(escaped ? code : (code))
        + '</pre></div>';
    }
    return '<div class="'
      + [this.options.langPrefix + lang, classes.root].join(' ')
      + '">'
      + `<pre class="${classes.pre}">`
      + escape(prism.highlight(escaped ? code : (code), prism.languages[lang]))
      + '</pre></div>\n';
  };

  renderer.codespan = function(text) {
    return '<code>' + text + '</code>';
  };

  const html = marked(markdown, { renderer });

  return html;
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
    return html.replace(escapeReplace, (ch) => replacements[ch]);
  }

  return html;
}
