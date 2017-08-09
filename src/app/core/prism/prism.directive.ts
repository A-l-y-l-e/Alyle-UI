import { Directive, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';
import { PrismPipe } from '../pipes/prism/prism.pipe';

@Directive({
  selector: '[prism], prism'
})
export class PrismDirective implements AfterViewInit {
  private _language: string;
  private _content: HTMLElement;
  @Input('language')
  set language(val: string) {
    this._language = val;
    this.transformData(this._language);
  }
  @Input('src')
  set src(val: string) {
    this._language = val;
  }

  constructor(private _elementRef: ElementRef, private _prismPipe: PrismPipe) {
    this._elementRef.nativeElement.style.display = 'none';
    let div = document.createElement('div');
    this._content = div;
    this._elementRef.nativeElement.after(this._content);
  }
  transformData(lang: string) {
    let data = this._elementRef.nativeElement.innerHTML;
    this._content.innerHTML = this._prismPipe.transform(data, lang);
  }
  ngAfterViewInit() {
    if(this._language) {
      this.transformData(this._language);
    }
  }

}
