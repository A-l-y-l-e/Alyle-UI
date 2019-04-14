import * as chroma from 'chroma-js';
import { prismCustomClass } from './prism-custom-class';

const Prism = require('prismjs');
Prism.languages.typescript = Prism.languages.extend('javascript', {
  // tslint:disable-next-line:max-line-length
  keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
  builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
});
Prism.languages.ts = Prism.languages.typescript;

require('prismjs/components/prism-markdown');
require('prismjs/components/prism-json');
require('prismjs/plugins/custom-class/prism-custom-class');

Prism.plugins.customClass.map(prismCustomClass());

Prism.hooks.add('wrap', function(env) {
  if (env.type === 'string') {
    const VALUE = env.content.slice(1).slice(0, -1);
    if (
      /(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s\/]*[\d\.]+%?\))/i.test(env.content) || VALUE in chroma['colors']) {
      try {
        const chromaColor = chroma(VALUE);
        const luminance = chromaColor.luminance();
        env.attributes.style = `background:${VALUE};color:${luminance < 0.5 ? 'white' : '#202020'};opacity:${chromaColor.alpha()}`;
      } catch (error) { }
    }
  }
});

export const prism = Prism;
