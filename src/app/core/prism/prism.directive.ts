import { Component, ElementRef, Input, OnInit, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { Platform, LyTheme2 } from '@alyle/ui';
import { PrismService } from './prism.service';

import * as _chroma from 'chroma-js';
import { AUIThemeVariables } from '../../app.module';
const chroma = _chroma;

const Prism = require('prismjs');
Prism.languages.typescript = Prism.languages.extend('javascript', {
  // tslint:disable-next-line:max-line-length
  keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
  builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
});
Prism.languages.ts = Prism.languages.typescript;

require('prismjs/components/prism-markdown');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-json');
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

const $host = 'https://raw.githubusercontent.com/A-l-y-l-e/Alyle-UI/1.7.0-beta.461kq/src/assets/firacode/';

const GLOBAL_STYLES = {
  '@global': {
    '@font-face': {
        fontFamily: 'Fira Code',
        src: `url('${$host}eot/FiraCode-Light.eot')`,
        'src ': `url('${$host}eot/FiraCode-Light.eot') format('embedded-opentype'),
            url('${$host}woff2/FiraCode-Light.woff2') format('woff2'),
            url('${$host}woff/FiraCode-Light.woff') format('woff'),
            url('${$host}ttf/FiraCode-Light.ttf') format('truetype')`,
        fontWeight: 300,
        fontStyle: 'normal',
    },
    '@font-face ': {
        fontFamily: 'Fira Code',
        src: `url('${$host}eot/FiraCode-Regular.eot')`,
        'src ': `url('${$host}eot/FiraCode-Regular.eot') format('embedded-opentype'),` +
            `url('${$host}woff2/FiraCode-Regular.woff2') format('woff2'),` +
            `url('${$host}woff/FiraCode-Regular.woff') format('woff'),` +
            `url('${$host}ttf/FiraCode-Regular.ttf') format('truetype')`,
        fontWeight: 400,
        fontStyle: 'normal'
    },

    '@font-face  ': {
        fontFamily: 'Fira Code',
        src: `url('${$host}eot/FiraCode-Medium.eot')`,
        'src ': `url('${$host}eot/FiraCode-Medium.eot') format('embedded-opentype'),` +
            `url('${$host}woff2/FiraCode-Medium.woff2') format('woff2'),` +
            `url('${$host}woff/FiraCode-Medium.woff') format('woff'),` +
            `url('${$host}ttf/FiraCode-Medium.ttf') format('truetype')`,
        fontWeight: 500,
        fontStyle: 'normal'
    },

    '@font-face   ': {
        fontFamily: 'Fira Code',
        src: `url('${$host}eot/FiraCode-Bold.eot')`,
        'src ': `url('${$host}eot/FiraCode-Bold.eot') format('embedded-opentype'),` +
            `url('${$host}woff2/FiraCode-Bold.woff2') format('woff2'),` +
            `url('${$host}woff/FiraCode-Bold.woff') format('woff'),` +
            `url('${$host}ttf/FiraCode-Bold.ttf') format('truetype')`,
        fontWeight: 700,
        fontStyle: 'normal'
    },
    'prism': {
      display: 'block',
      padding: '1em'
    }
  }
};

const classes = (theme: AUIThemeVariables) => ({
  root: {
    color: theme.codeColor,
    backgroundColor: theme.codeBg,
    marginBottom: '.5em',
    direction: 'ltr',
    'pre[class*="language-"]': {
      padding: '1em',
      margin: '.5em 0',
      overflow: 'auto',
    },
    '& code[class*="language-"], & pre[class*="language-"]': {
      background: 'none',
      fontFamily: `'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
      textAlign: 'left',
      fontSize: '13px',
      fontWeight: 500,
      whiteSpace: 'pre-wrap',
      wordSpacing: 'normal',
      wordBreak: 'break-word',
      wordWrap: 'normal',
      lineHeight: 1.5,
      '-moz-tab-size': 4,
      '-o-tab-size': 4,
      tabSize: 4,
      '-webkit-hyphens': 'none',
      '-moz-hyphens': 'none',
      '-ms-hyphens': 'none',
      hyphens: 'none',
    }
  }
});

const STYLES = (theme: AUIThemeVariables) => ({
  token: {
    color: theme.prism.colorText,
    '&{keyword}, &{selector-tag}, &{title}, &{section}, &{doctag}, &{name}, &{strong}': {
      color: theme.prism.keyword,
      fontWeight: '600'
    },
    '&{comment}': {
      color: 'rgba(115, 129, 145, 0.65)'
    },
    '&{string}, &{title}, &{section}, &{built_in}, &{literal}, &{type}, &{addition}, &{tag}, &{quote}, &{name}, &{selector-id}, &{selector-class}': {
      color: '#ff5085'
    },
    '&{meta}, &{subst}, &{symbol}, &{regexp}, &{attribute}, &{deletion}, &{variable}, &{template-variable}, &{link}, &{bullet}': {
      color: '#4c81c9'
    },
    '&{emphasis}': {
      fontStyle: 'italic'
    },
    '&{function}': {
      color: '#4584ff'
    },
    '&{attr-name}': {
      color: '#FFB62C'
    },
    '&{attr-value}': {
      color: theme.prism.keyword
    },
    '&{string}': {
      color: theme.prism.string
    },
    '&{number}': {
      color: 'rgb(36, 212, 158)'
    },
    '&{punctuation}, &{operator}': {
      color: '#9786c5'
    },
    '&{class-name}': {
      color: chroma(theme.accent.default).alpha(.88).css()
    },
    '&{constant}': {
      color: '#EF5350'
    },
    '&{builtin}': {
      color: '#8796b0'
    }
  },
  keyword: null,
  'selector-tag': null,
  title: null,
  section: null,
  doctag: null,
  name: null,
  strong: null,
  comment: null,
  string: null,
  built_in: null,
  literal: null,
  type: null,
  addition: null,
  tag: null,
  quote: null,
  'selector-id': null,
  'selector-class': null,
  meta: null,
  subst: null,
  symbol: null,
  regexp: null,
  attribute: null,
  deletion: null,
  variable: null,
  'template-variable': null,
  link: null,
  bullet: null,
  emphasis: null,
  function: null,
  punctuation: null,
  number: null,
  operator: null,
  constant: null,
  'attr-value': null,
  'attr-name': null,
  'class-name': null,
  builtin: null,
  property: null
});

const NOP_STYLES = {};

@Component({
  selector: '[prism], prism',
  template: `<code class="language-">{{ code }}</code>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrismDirective implements OnInit {
  classes = this.theme.addStyleSheet(classes, -2);
  prismClasses = Platform.isBrowser ? this.theme.addStyleSheet(STYLES, -2) : NOP_STYLES;
  private _code: string;
  @Input() language = 'ts';
  @Input()
  set code(val) {
    this._code = val;
    this.codeToHtml(val);
  }
  get code() { return this._code; }

  constructor(
    private theme: LyTheme2,
    private _elementRef: ElementRef,
    private renderer: Renderer2,
    _prismService: PrismService
  ) {
    theme.addStyleSheet(GLOBAL_STYLES);
    _prismService.setCustomClass(this.prismClasses);
  }

  ngOnInit() {
    this.renderer.addClass(this._elementRef.nativeElement, this.classes.root);
  }
  codeToHtml(val: string) {
    if (Platform.isBrowser) {
      let code: string;
      const containerCode = this.renderer.createElement('code');
      if (this.language === 'ts') {
        this.renderer.addClass(containerCode, 'language-typescript');
        code = Prism.highlight(`${val}`, Prism.languages.javascript);
      } else {
        this.renderer.addClass(containerCode, `language-${this.language}`);
        code = Prism.highlight(`${val}`, Prism.languages[this.language]);
      }
      containerCode.innerHTML = code;
      this._elementRef.nativeElement.innerHTML = '';
      this.renderer.appendChild(this._elementRef.nativeElement, containerCode);
    }
  }

}
