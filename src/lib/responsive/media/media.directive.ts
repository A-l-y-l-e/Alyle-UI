import {
  Directive,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { ResponsiveService } from '../media.service';
import { WindowSize } from '../window-size';

@Directive({
  selector: '[lyResponsive]',
  exportAs: 'lyResponsive',
})
export class MediaDirective implements AfterViewInit, OnDestroy {
  // @Input() lyResponsive: string;
  windowSize: WindowSize;
  private _medias: | string;
  view: Subscription;
  @ViewChild(MediaDirective) templateRoot: ViewChild;
  // @Input('ly-media') media: string;
  private _ngTransclude: TemplateRef<any>;

  @Input()
  public set lyResponsive(val: | string) {
    this._medias = val;
    this.updateView();
  }
  converterToPx(num: string): number {
    return parseFloat(num.replace('px', ''));
  }

  public get lyResponsive(): | string {
    return this._medias;
  }
  constructor(
    private viewRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private mediaService: ResponsiveService
  ) {
    this.view = this.mediaService.stateView.subscribe((windowSize: WindowSize) => {
      this.windowSize = windowSize;
      this.updateView();
    });
  }

  updateView() {
    if (!!this._medias && this.mediaService.matchMedia(this._medias)) {
      if (this.viewRef.length === 0) {
        this.viewRef.createEmbeddedView(this.templateRef);
      }
    } else if (this.viewRef.length !== 0) {
      this.viewRef.detach();
      this.viewRef.remove();
    }
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.view.unsubscribe();
  }

}
