import { EmbeddedViewRef, ComponentRef, ComponentFactoryResolver, ApplicationRef, TemplateRef, Injector, Type } from '@angular/core';
import { Subscription, merge } from 'rxjs';
import { LyOverlayConfig } from './overlay-config';
import { LyOverlayBackdrop } from './overlay-backdrop';
import { LyOverlayContainer } from './overlay-container';
import { createOverlayInjector } from './overlay-injector';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';

export class OverlayFactory<T = any> {
  private _viewRef: EmbeddedViewRef<any>;
  private _el?: HTMLDivElement;
  private _backdropElement?: Element;
  private _compRef: ComponentRef<T> | null;
  private _compRefOverlayBackdrop?: ComponentRef<any> | null;
  private _windowSRSub: Subscription = Subscription.EMPTY;

  private _newInjector: Injector;
  /** Function that will be called on scroll or resize event */
  onResizeScroll: (() => void) | null;

  get injector(): Injector | undefined {
    return this._newInjector;
  }

  get containerElement() {
    return this._el as HTMLDivElement;
  }
  get componentRef() {
    return this._compRef;
  }
  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    _templateRefOrComponent: TemplateRef<any> | Type<T> | string,
    private _overlayContainer: LyOverlayContainer,
    _context: any,
    private _injector: Injector,
    _scrollDispatcher: ScrollDispatcher,
    _viewportRuler: ViewportRuler,
    _config?: LyOverlayConfig
  ) {
    const config = { ...new LyOverlayConfig(), ..._config };
    this._el = document.createElement('div');
    const __styles = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none'
    };
    if (config) {
      Object.assign(__styles, config.styles);
    }

    const newInjector = this._newInjector = createOverlayInjector(config.injector || this._injector, {
      fnDestroy: this.destroy.bind(this),
        ...config,
        styles: __styles,
      }, this);

    this._updateStyles(__styles);
    if (config) {
      if (config.onResizeScroll) {
        this.onResizeScroll = config.onResizeScroll;
      }

      this._windowSRSub = merge(_scrollDispatcher.scrolled(0), _viewportRuler.change()).subscribe(() => {
        if (this.onResizeScroll) {
          this.onResizeScroll();
        }
      });

      if (config.classes) {
        const classes = config.classes;
        classes.forEach((className) => (this._el as HTMLDivElement).classList.add(className));
      }
    }
    this.updateBackdrop(!!config.hasBackdrop);
    this._appendComponentToBody(_templateRefOrComponent, _context, newInjector);
    this._updateBackdropPosition();

  }

  updateBackdrop(hasBackdrop: boolean) {
    if (hasBackdrop) {
      if (this._compRefOverlayBackdrop) {
        return;
      }
      this._compRefOverlayBackdrop = this._generateComponent(LyOverlayBackdrop, this._newInjector);
      this._appRef.attachView(this._compRefOverlayBackdrop.hostView);
      this._backdropElement = this._compRefOverlayBackdrop.location.nativeElement;
      this._overlayContainer._add(this._backdropElement!);
    } else if (this._compRefOverlayBackdrop) {
      this._appRef.detachView(this._compRefOverlayBackdrop.hostView);
      this._backdropElement = this._compRefOverlayBackdrop.location.nativeElement;
      this._overlayContainer._remove(this._backdropElement);
      this._compRefOverlayBackdrop = null;
    }
    this._updateBackdropPosition();
  }

  private _updateStyles(__styles: object) {
    /** Apply styles */
    /** set styles */
    for (const key in __styles) {
      if (__styles.hasOwnProperty(key)) {
        const styleVal = __styles[key];
        if (styleVal != null) {
          this._el!.style[key] = typeof __styles[key] === 'number' ? `${styleVal}px` : styleVal;
        }
      }
    }
  }

  private _appendComponentToBody(type: TemplateRef<any> | Type<any> | string, context, injector: Injector) {
    if (type instanceof TemplateRef) {
      // Create a component reference from the component
      const viewRef = this._viewRef = type.createEmbeddedView(context || {});
      this._appRef.attachView(viewRef);

      // Get DOM element from component
      viewRef.rootNodes.forEach(_ => this._el!.appendChild(_));

      // Append DOM element to the body
      this._overlayContainer._add(this._el!);
    } else if (typeof type === 'string') {
      this._el!.innerText = type;
      this._overlayContainer._add(this._el!);
    } else {
      this._compRef = this._generateComponent(type, injector);
      this._appRef.attachView(this._compRef.hostView);
      this._el!.appendChild(this._compRef.location.nativeElement);
      this._overlayContainer._add(this._el!);
    }
  }

  private _updateBackdropPosition() {
    const container = this._overlayContainer.containerElement;
    if (
      this._backdropElement?.parentElement === container
      && this._el?.parentElement === container
    ) {
      this._overlayContainer.containerElement.insertBefore(this._backdropElement, this._el);
    }
  }

  private _generateComponent(type: Type<any>, injector: Injector) {
    const factory = this._componentFactoryResolver.resolveComponentFactory(type);
    return factory.create(injector);
  }

  /** Detaches a view from dirty checking again of ApplicationRef. */
  detach() {
    if (this._viewRef) {
      this._appRef.detachView(this._viewRef);
    }
    if (this._compRef) {
      this._appRef.detachView(this._compRef.hostView);
    }
  }

  /** Remove element of DOM */
  remove() {
    if (this._viewRef) {
      this._viewRef.destroy();
      this._overlayContainer._remove(this._el);
      this._el = undefined;
    } else if (this._compRef) {
      this._compRef.destroy();
      this._overlayContainer._remove(this._el);
      this._el = undefined;
      this._compRef = null;
    } else if (this._el) {
      // remove if template is string
      this._overlayContainer._remove(this._el);
      this._el = undefined;
    }
    this.updateBackdrop(false);
    this._windowSRSub.unsubscribe();
  }

  /** Detach & remove */
  destroy() {
    this.detach();
    this.remove();
  }
}
