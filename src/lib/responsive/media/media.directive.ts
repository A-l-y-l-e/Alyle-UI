import {
  Directive,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  EmbeddedViewRef,
  Inject
} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { Responsive } from '../media.service';

@Directive({
  selector: '[lyResponsive]'
})
export class MediaDirective implements OnInit, OnDestroy {
  private _media: string;
  view: Subscription;
  private _TemplateRef: TemplateRef<any>|null = null;

  @Input()
  set lyResponsive(val: string) {
    this._media = val;
    this.updateView();
  }

  get media(): string {
    return this._media;
  }
  constructor(
    private _viewContainer: ViewContainerRef,
    templateRef: TemplateRef<any>,
    private mediaService: Responsive,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this._TemplateRef = templateRef;
  }

  ngOnInit() {
    this.view = this.mediaService.stateView().subscribe(() => {
      this.updateView();
    });
  }

  updateView() {
    if (isPlatformServer(this.platformId) || this.mediaService.matchMedia(this._media)) {
      if (this._viewContainer.length === 0) {
        this._viewContainer.createEmbeddedView(this._TemplateRef);
      }
    } else if (this._viewContainer.length !== 0) {
      this._viewContainer.clear();
    }
  }

  ngOnDestroy() {
    if (this.view) {
      this.view.unsubscribe();
    }
  }

}
