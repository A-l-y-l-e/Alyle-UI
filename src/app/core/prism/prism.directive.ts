import { Component, ElementRef, Input, OnInit, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { Platform, LyTheme2, ThemeVariables } from '@alyle/ui';
import { PrismService } from './prism.service';

const Prism = require('prismjs');
const PrismTypescript = require('prismjs/components/prism-typescript');
const PrismMarkdown = require('prismjs/components/prism-markdown');
const PrismBash = require('prismjs/components/prism-bash');
const PrismJson = require('prismjs/components/prism-json');

const classes = theme => ({
  '@global': {
    'prism': {
      display: 'block',
      padding: '1em'
    }
  },
  root: {
    color: theme.codeColor,
    backgroundColor: theme.codeBg,
    margin: '1em 0',
    'pre[class*="language-"]': {
      padding: '1em',
      margin: '.5em 0',
      overflow: 'auto'
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

const STYLES = (theme: ThemeVariables) => ({
  token: {
    '&{keyword}, &{selector-tag}, &{title}, &{section}, &{doctag}, &{name}, &{strong}': {
      color: theme.accent.default
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
    '&{tag} > {punctuation}, &{attr-value} > {punctuation}:first-child': {
      color: '#39ADB5'
    },
    '&{attr-name}': {
      color: '#FFB62C'
    },
    '&{attr-value}': {
      color: '#7c4dff'
    },
    '&{string}': {
      color: '#8BC34A'
    },
    '&{number}': {
      color: 'rgb(36, 212, 158)'
    },
    '&{punctuation}, &{operator}': {
      color: '#7c4dff'
    },
    '&{class-name}': {
      color: theme.primary.default
    },
    '&{constant}': {
      color: '#EF5350'
    }
  },
  keyword: { },
  'selector-tag': { },
  title: { },
  section: { },
  doctag: { },
  name: { },
  strong: { },
  comment: { },
  string: { },
  built_in: { },
  literal: { },
  type: { },
  addition: { },
  tag: { },
  quote: { },
  'selector-id': { },
  'selector-class': { },
  meta: { },
  subst: { },
  symbol: { },
  regexp: { },
  attribute: { },
  deletion: { },
  variable: { },
  'template-variable': { },
  link: { },
  bullet: { },
  emphasis: { },
  function: { },
  punctuation: { },
  number: { },
  operator: { },
  constant: { },
  'attr-value': { },
  'attr-name': { },
  'class-name': { }
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
