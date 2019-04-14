import * as chroma from 'chroma-js';
import { prismCustomClass } from './prism-custom-class';

import * as Prism from 'prismjs';

Prism.languages.typescript = Prism.languages.extend('javascript', {
  // tslint:disable-next-line:max-line-length
  keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
  builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
});
Prism.languages.ts = Prism.languages.typescript;

require('prismjs/components/prism-markdown');
require('prismjs/components/prism-json');
require('prismjs/components/prism-bash');
require('prismjs/plugins/custom-class/prism-custom-class');

Prism.plugins.customClass.map(prismCustomClass());

Prism.hooks.add('wrap', function(env) {
  if (env.type === 'string') {
    env.content = addColors(env.content);
  }
});


function addColors(str: string) {
  const colorRegexr = /(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s\/]*[\d\.]+%?\))/ig;
  const colorRegexr2 = new RegExp(Object.keys(chroma['colors']).join('|'), 'ig');
  const Re = new RegExp(colorRegexr.source + '|' + colorRegexr2.source);
  const replacer = (ch: string) => {
    if (chroma['valid'](ch)) {
      const chromaColor = chroma(ch);
      const luminance = chromaColor.luminance();
      return `<span style="background:${ch};color:${luminance < 0.5 ? 'white' : '#202020'};opacity:${chromaColor.alpha()}">${ch}</span>`;
    }
    return ch;
  };
  if (Re.test(str)) {
    return str
    .replace(Re, replacer);
  }
  return str;
}

export const prism = Prism;
