import { Component, ElementRef, Input, OnInit, Inject, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Platform } from '@alyle/ui';
import { PrismService } from './prism.service';

const Prism = require('prismjs');
const PrismTypescript = require('prismjs/components/prism-typescript');
const PrismMarkdown = require('prismjs/components/prism-markdown');
const PrismBash = require('prismjs/components/prism-bash');
const PrismJson = require('prismjs/components/prism-json');

@Component({
  selector: '[prism], prism',
  template: `<code class="language-">{{ code }}</code>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrismDirective {
  private _code: string;
  @Input() language = 'ts';
  @Input()
  set bg(val) {
    console.log('remove this.', {val});
  }
  @Input()
  set code(val) {
    this._code = val;
    this.codeToHtml(val);
  }
  get code() { return this._code; }

  constructor(
    private _elementRef: ElementRef,
    private renderer: Renderer2,
    prismService: PrismService,
    @Inject(DOCUMENT) private document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    renderer.addClass(_elementRef.nativeElement, prismService.classes.root);
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
