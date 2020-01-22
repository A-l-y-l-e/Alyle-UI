import * as _chroma from 'chroma-js';
import { prismCustomClass } from './prism-custom-class';

import * as Prism from 'prismjs';

interface Chroma extends _chroma.ChromaStatic {
  colors: {
    [key: string]: string
  };
  valid: (color: string) => boolean;
}

const chroma = _chroma as Chroma;

require('prismjs/components/prism-markdown');
require('prismjs/components/prism-typescript');
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
  const colorRegexr2 = new RegExp(Object.keys(chroma.colors).join('|'), 'ig');
  const Re = new RegExp(colorRegexr.source + '|' + colorRegexr2.source);
  const replacer = (ch: string) => {
    if (chroma.valid(ch)) {
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
