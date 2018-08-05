import {
  Directive, Input, TemplateRef, ViewContainerRef, Output, EventEmitter, AfterContentInit, OnDestroy, NgModule
} from '@angular/core';

export interface KeyAttribute {
  [key: string]: any;
}

@Directive({
  selector: '[ngTransclude]'
})
export class NgTranscludeDirective implements OnDestroy {

  private _ngTransclude: TemplateRef<any>;

  @Input()
  set status(val: boolean) {
    console.log('val', val);
  }
  @Input()
  set ngTransclude(templateRef: TemplateRef<any>) {
    if (templateRef) {
      console.log('creating view');
      this._ngTransclude = templateRef;
      this._viewRef.createEmbeddedView(templateRef);
    }
  }

  get ngTransclude(): TemplateRef<any> {
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
