import {
  Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, NgModule, ElementRef
} from '@angular/core';
import { Platform } from '../platform/index';

export interface KeyAttribute {
  [key: string]: any;
}

@Directive({
  selector: '[ngTransclude]',
  exportAs: 'ngTransclude'
})
export class NgTranscludeDirective implements OnDestroy {

  private _ngTransclude: TemplateRef<any> | null;

  /**
   * Time in ms it takes before it is destroyed
   */
  @Input() timeout: number;

  _timeoutId: number;

  @Input()
  set ngTransclude(templateRef: TemplateRef<any>) {
    if (templateRef && !this._ngTransclude) {
      if (Platform.isBrowser && this._timeoutId != null) {
        window.clearTimeout(this._timeoutId);
        this._timeoutId = null!;
        this.vcr.clear();
      }
      this._ngTransclude = templateRef;
      this.vcr.createEmbeddedView(templateRef);
    } else if (this._ngTransclude && !templateRef) {
      this._ngTransclude = null;
      this.clear();
    }
  }

  get getNgTransclude() {
    return this._ngTransclude;
  }

  constructor(readonly vcr: ViewContainerRef) { }

  clear() {
    if (Platform.isBrowser && this.timeout) {
      this._timeoutId = window.setTimeout(() => {
        this.vcr.clear();
        this._timeoutId = null!;
      }, this.timeout);
    } else {
      this.vcr.clear();
    }
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      window.clearTimeout(this._timeoutId);
    }
    this.vcr.clear();
  }
}
@NgModule({
  exports: [NgTranscludeDirective],
  declarations: [NgTranscludeDirective]
})
export class NgTranscludeModule {

}

/**
 * @ignore
 */
export function getNativeElement(element: HTMLElement | ElementRef<HTMLElement>): HTMLElement {
  return element instanceof ElementRef ? element.nativeElement : element;
}
