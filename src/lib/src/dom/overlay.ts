import { TemplateRef, Injectable, ApplicationRef, ComponentFactoryResolver, Injector, Type } from '@angular/core';
import { LyOverlayContainer } from './overlay-container';
import { OverlayFactory } from './overlay-factory';
import { LyOverlayConfig } from './overlay-config';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';

@Injectable()
export class LyOverlay {

  constructor(
    private _overlayContainer: LyOverlayContainer,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _scrollDispatcher: ScrollDispatcher,
    private _viewportRuler: ViewportRuler
  ) { }

  create<T>(templateOrComponent: Type<T> | TemplateRef<any> | string, context?: any, config?: LyOverlayConfig) {
    return new OverlayFactory<T>(
      this._componentFactoryResolver,
      this._appRef,
      templateOrComponent,
      this._overlayContainer,
      context,
      this._injector,
      this._scrollDispatcher,
      this._viewportRuler,
      config
    );
  }
}
