import { Component, ElementRef, Input, OnInit, Inject, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Platform, LyTheme2 } from '@alyle/ui';

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
export class PrismDirective implements OnInit {
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

  get classes() {
    return {
      root: this.theme.setUpStyle('prism', {
        '': () => (
          `color: ${this.theme.config.codeColor};` +
          `background-color: ${this.theme.config.codeBg};`
        )
      })
    };
  }

  constructor(
    private theme: LyTheme2,
    private _elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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
