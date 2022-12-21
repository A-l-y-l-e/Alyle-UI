import { prismCustomClass } from './prism-custom-class.mjs';
import { prism } from './prism.mjs';

export function highlight(code: string, lang: string | null, inline?: boolean): string {
  const classes = prismCustomClass();
  const gramar = lang ? prism.languages[lang] : null;
  code = ((gramar)
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

function htmlEncode(text: string) {
  return (
    text
      .replace(/\&/g, '&amp;')
      .replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;')
  );
}

