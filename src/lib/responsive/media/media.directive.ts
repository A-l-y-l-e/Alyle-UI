import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  Inject,
  Optional,
  Renderer2,
  ElementRef,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Subscription } from 'rxjs';

import { Responsive } from '../media.service';
import { CoreTheme, InvertMediaQuery } from '@alyle/ui';
import { LY_MEDIA_QUERIES } from '../tokens';

@Directive({
  selector: '[lyResponsive], [lyShow], [lyHide]'
})
export class MediaDirective implements OnInit, OnDestroy {
  private _media: string;
  view: Subscription;
  private _show: string;
  private _showClass: string;
  private _hide: string;
  private _hideClass: string;
  private _TemplateRef: TemplateRef<any>|null = null;
  classes = {
    hide: this.coreTheme.setUpStyle('k-media-hide', 'display:none;', 'all')
  };

  /** @deprecated */
  @Input()
  set lyResponsive(val: string) {
    this._media = val;
    this.updateView();
  }

  get media(): string {
    return this._media;
  }

  @Input()
  set lyShow(val: string) {
    this._show = val;
    const newClass = this.coreTheme.setUpStyle(`k-media-show-${val}`,
    (
      `display: block;`
    )
    ,
    `${this.mediaQueries[val] || val}`// , InvertMediaQuery.Yes
    );
    this.coreTheme.updateClassName(this._elementRef.nativeElement, this._renderer, newClass, this._showClass);
    this._showClass = newClass;
  }

  get lyShow(): string {
    return this._show;
  }

  @Input()
  set lyHide(val: string) {
    this._hide = val;
    const newClass = this.coreTheme.setUpStyle(`k-media-hide-${val}`,
    (
      `display: none !important;`
    )
    ,
    `${this.mediaQueries[val] || val}`
    );
    this.coreTheme.updateClassName(this._elementRef.nativeElement, this._renderer, newClass, this._hideClass);
    this._hideClass = newClass;
  }

  get lyHide(): string {
    return this._hide;
  }

  constructor(
    private _viewContainer: ViewContainerRef,
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    @Optional() templateRef: TemplateRef<any>,
    private mediaService: Responsive,
    private coreTheme: CoreTheme,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(LY_MEDIA_QUERIES) private mediaQueries: any, // { [key: string]: string; }
  ) {
    this._TemplateRef = templateRef;
  }

  ngOnInit() {
    if (!this.lyHide) {
      this._renderer.addClass(this._elementRef.nativeElement, this.classes.hide);
    }
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
