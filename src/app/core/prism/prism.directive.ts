import { Directive, ElementRef, Input, OnInit, AfterViewInit, Inject, Renderer2 } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { PrismPipe } from '../pipes/prism/prism.pipe';
import { Platform } from '@alyle/ui';

const Prism = require('prismjs');
const PrismTypescript = require('prismjs/components/prism-typescript');
const PrismMarkdown = require('prismjs/components/prism-markdown');
const PrismBash = require('prismjs/components/prism-bash');
const PrismJson = require('prismjs/components/prism-json');

@Directive({
  selector: '[prism], prism'
})
export class PrismDirective implements AfterViewInit {
  private _language: string;
  private _content: HTMLElement;
  @Input() language = 'ts';
  @Input()
  set code(val) {
    this.codeToHtml(val);
  }
  @Input('src')
  set src(val: string) {
    this._language = val;
  }

  constructor(
    private _elementRef: ElementRef,
    private renderer: Renderer2,
    private _prismPipe: PrismPipe,
    @Inject(DOCUMENT) private document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  codeToHtml(val: string) {
    if (Platform.isBrowser) {
      let code: string;
      const containerCode = this.renderer.createElement('code');
      if (this.language === 'ts') {
        this.renderer.addClass(containerCode, 'language-javascript');
        code = Prism.highlight(`${val}`, Prism.languages.javascript);
      } else {
        this.renderer.addClass(containerCode, `language-${this.language}`);
        code = Prism.highlight(`${val}`, Prism.languages[this.language]);
      }
      containerCode.innerHTML = code;
      this.renderer.appendChild(this._elementRef.nativeElement, containerCode);
    }
  }

  transformData(lang: string) {
    const data = this._elementRef.nativeElement.innerHTML;
    this._content.innerHTML = this._prismPipe.transform(data, lang);
  }
  ngAfterViewInit() {
    if (this._language) {
      this.transformData(this._language);
    }
  }

}
