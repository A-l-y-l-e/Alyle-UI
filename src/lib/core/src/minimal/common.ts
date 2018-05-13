import {
  Directive, Input, TemplateRef, ViewContainerRef, Output, EventEmitter, AfterContentInit, OnDestroy, NgModule
} from '@angular/core';

export interface KeyAttribute {
  [key: string]: any;
}

@Directive({
  selector: '[ngTransclude]'
})
export class NgTranscludeDirective implements AfterContentInit, OnDestroy {
  public viewRef: ViewContainerRef;

  private _ngTransclude: TemplateRef<any>;

  @Input()
  public set ngTransclude(templateRef: TemplateRef<any>) {
    this._ngTransclude = templateRef;
    if (templateRef) {
      this.viewRef.createEmbeddedView(templateRef);
    }
  }
  @Output() ngTranscludeChange: EventEmitter<any> = new EventEmitter<any>();

  public get ngTransclude(): TemplateRef<any> {
    return this._ngTransclude;
  }

  public constructor(private _viewRef: ViewContainerRef) {
    this.viewRef = _viewRef;
  }
  ngAfterContentInit() {
    this.ngTranscludeChange.emit(true);
  }
  ngOnDestroy() {
    this.viewRef.detach();
  }
}
@NgModule({
  exports: [NgTranscludeDirective],
  declarations: [NgTranscludeDirective]
})
export class NgTranscludeModule {

}
