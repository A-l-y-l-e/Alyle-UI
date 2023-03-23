import chroma from 'chroma-js';
import { prismCustomClass } from './prism-custom-class.mjs';

import Prism from 'prismjs';

import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/plugins/custom-class/prism-custom-class.js';

Prism.plugins[ 'customClass' ].map(prismCustomClass());
Prism.hooks.add('wrap', function(env) {
  if (env.type === 'string') {
    env.content = addColors(env.content!);
  }
});

function addColors(str: string) {
  const colorRegexr = /(?:#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s\/]*[\d\.]+%?\))/ig;
  const colorRegexr2 = new RegExp(Object.keys((chroma as any).colors).join('|'), 'ig');
  const Re = new RegExp(colorRegexr.source + '|' + colorRegexr2.source, 'ig');
  const hasColor = Re.test(str);
  const replacer = (ch: string) => {
    if (chroma.valid(ch)) {
      const chromaColor = chroma(ch);
      return `<span style="display:inline-block;vertical-align:middle;width:14px;height:14px;border-radius:4px;background:${ch};opacity:${chromaColor.alpha()}"></span>${ch}`;
    }
    return ch;
  };
  if (hasColor) {
    return str
    .replace(Re, replacer);
  }
  return str;
}

Prism.languages.insertBefore('typescript', 'template-string', {
  'lyl-template-string': {
    pattern:
      /(lyl\ ?)`(?:\$\{[^}]+\}|\\\\|\\?[^\\])*?`/,
    lookbehind: true,
    greedy: true,
    inside: {
      interpolation: {
        pattern: /\$\{[^}]+\}/,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\$\{|\}$/,
            alias: 'punctuation'
          },
          rest: Prism.languages.typescript
        }
      },
      string: {
        pattern: /[^$;]+/,
        inside: Prism.languages.css,
        alias: 'language-css'
      }
    }
  }
});

export const prism = Prism;
