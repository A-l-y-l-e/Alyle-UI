import { Component, ElementRef, Input, OnInit, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { Platform, LyTheme2 } from '@alyle/ui';

const Prism = require('prismjs');
const PrismTypescript = require('prismjs/components/prism-typescript');
const PrismMarkdown = require('prismjs/components/prism-markdown');
const PrismBash = require('prismjs/components/prism-bash');
const PrismJson = require('prismjs/components/prism-json');

const classes = theme => ({
  root: {
    color: theme.codeColor,
    backgroundColor: theme.codeBg
  }
});

@Component({
  selector: '[prism], prism',
  template: `<code class="language-">{{ code }}</code>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrismDirective implements OnInit {
  classes = this.theme.addStyleSheet(classes, 'prism');
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
    private theme: LyTheme2,
    private _elementRef: ElementRef,
    private renderer: Renderer2,
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
