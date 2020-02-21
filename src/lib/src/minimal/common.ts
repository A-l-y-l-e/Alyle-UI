import {
  Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, NgModule, ElementRef
} from '@angular/core';

export interface KeyAttribute {
  [key: string]: any;
}

@Directive({
  selector: '[ngTransclude]'
})
export class NgTranscludeDirective implements OnDestroy {

  private _ngTransclude: TemplateRef<any> | null;

  @Input()
  set ngTransclude(templateRef: TemplateRef<any>) {
    if (templateRef && !this._ngTransclude) {
      this._ngTransclude = templateRef;
      this._viewRef.createEmbeddedView(templateRef);
    } else if (this._ngTransclude && !templateRef) {
      this._ngTransclude = null;
      this._viewRef.clear();
    }
  }

  get getNgTransclude() {
    return this._ngTransclude;
  }

  constructor(private _viewRef: ViewContainerRef) { }
  ngOnDestroy() {
    this._viewRef.remove();
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
