import {
  Directive,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { ResponsiveService } from '../media.service';

@Directive({
  selector: '[lyResponsive]',
  exportAs: 'lyResponsive',
})
export class MediaDirective implements OnDestroy {
  private _media: string;
  view: Subscription;
  @ViewChild(MediaDirective) templateRoot: ViewChild;
  private _ngTransclude: TemplateRef<any>;

  @Input()
  set lyResponsive(val: string) {
    this._media = val;
    this.updateView();
  }

  get media(): string {
    return this._media;
  }
  constructor(
    private viewRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private mediaService: ResponsiveService,
    private _cd: ChangeDetectorRef
  ) {
    this.view = this.mediaService.stateView.subscribe(() => {
      this.updateView();
    });
  }

  updateView() {
    if (!!this._media && this.mediaService.matchMedia(this._media)) {
      if (this.viewRef.length === 0) {
        this.viewRef.createEmbeddedView(this.templateRef);
        this._cd.markForCheck();
      }
    } else if (this.viewRef.length !== 0) {
      this.viewRef.detach();
      this.viewRef.remove();
    }
  }

  ngOnDestroy() {
    this.view.unsubscribe();
  }

}
