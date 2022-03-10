import * as showdown from 'showdown';
import { prism } from './prism';
import { prismCustomClass } from './prism-custom-class';
import * as domino from 'domino';
import { color } from '@alyle/ui/color';
// import { lyl } from '@alyle/ui';

global['color'] = color;
showdown.extension('custom', function() {
  return [{
    type: 'output',
    filter: function(text) {
      text = text
        .replace(
          /<p><aui[^]+><\/p>/ig,
          (str) => {
            return str.replace(/<\/?p>/g, '');
          }
        )
        .replace(
          /(<p>)<demo-view/g,
          (s, p) => s.replace(p, '')
        )
        .replace(
          /<\/demo-view>(<\/p>)/g,
          (s, p) => s.replace(p, '')
        );
      return text;
    }
  }];
});

showdown.extension('highlightColors', function() {
  return [{
    type: 'output',
    filter: function(text) {
      return highlightColors(text);
    }
  }];
});

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
    extensions: ['prism'],
    strikethrough: true
  });

  const html = converter.makeHtml(markdown);

  return html;
}

export function mdToHtml(markdown: string) {
  const converter = new showdown.Converter({
    extensions: ['custom', 'prism', 'highlightColors'],
    strikethrough: true,
    ghCompatibleHeaderId: true
  });

  const html = converter.makeHtml(markdown);

  return html;
}

function highlightColors(content: string) {
  if (content.includes('color')) {
    if (/<span[^>]+.color[^\(]+\([^\)]+\)<\/span>/.test(content)) {
      content = content.replace(/<span[^>]+.color[^\(]+\([^\)]+\)<\/span>/g, (item) => {
        const html = domino.createWindow(item);
        const el = html.document.body;
        if (el && el.textContent) {
          const text = el.textContent;
          const colorRgx = /color\(((?:[0-9a-f]+)|(?:0x[0-9a-f]+)|(?:[0-9a-f]+, [0-9a-f]+, [0-9a-f]+(?:, [.0-9]+)?))\)/g.exec(text);
          if (colorRgx && !text.includes('#')) {
            // tslint:disable-next-line: no-eval
            const rgba = color(...eval(`${colorRgx[0]}.rgba()`));
            const lum = rgba.luminance();
            const id = `_${Math.floor(Math.random() * Date.now()).toString(36)}`;
            // const styl = lyl `{
            //   & {
            //     background: ${rgba.css()}
            //     opacity: ${rgba.alpha()}
            //   }
            //   * {
            //     color: ${lum < 0.5 ? 'white' : '#202020'} !important
            //   }
            // }`(`.${id}`);
            const styl = `.${id}{`
              + `background:${rgba.css()};`
              + `opacity:${rgba.alpha()}`
              + `}`
              + `.${id} *{`
              + `color: ${lum < 0.5 ? 'white' : '#202020'} !important`
              + `}`;

            return `<style>${styl}</style><span class="${id}">${item}</span>`;
          }
        }
        return item;
      });
    }
  }
  return content;
}

/**
 * Convert code to highlighted HTML
 */
export function highlight(code: string, lang: string | null, inline?: boolean): string {
  const classes = prismCustomClass();
  const gramar = lang ? prism.languages[lang] : null;
  code = escape((gramar)
    ? prism.highlight(code, gramar, lang!)
    : htmlEncode(code));
  if (inline) {
    // Preserve white spaces
    code = code.replace(/<\/span> <span/g, '</span>&nbsp;<span');
    return `<code class="${[classes.code, classes.inline].join(' ')}">${code}</code>`;
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
