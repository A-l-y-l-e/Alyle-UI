import { EmbeddedViewRef, ComponentRef, ComponentFactoryResolver, ApplicationRef, TemplateRef, Injector, Type } from '@angular/core';
import { Subscription, merge } from 'rxjs';
import { WinScroll } from './scroll';
import { WinResize } from './resize';
import { LyOverlayConfig } from './overlay-config';
import { LyOverlayBackdrop } from './overlay-backdrop';
import { LyOverlayContainer } from './overlay-container';
import { createOverlayInjector } from './overlay-injector';

export type OverlayFactoryRef<T = any> = OverlayFactory<T>;
export class OverlayFactory<T = any> {
  private _viewRef: EmbeddedViewRef<any>;
  private _el?: HTMLDivElement;
  private _compRef: ComponentRef<T> | null;
  private _compRefOverlayBackdrop: ComponentRef<any>;
  private _windowSRSub: Subscription = Subscription.EMPTY;

  /** Function that will be called on scroll or resize event */
  onResizeScroll: (() => void) | null;

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
    windowScroll: WinScroll,
    resizeService: WinResize,
    config?: LyOverlayConfig
  ) {
    config = { ...new LyOverlayConfig(), ...config };
    this._el = document.createElement('div');
    const __styles = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'all'
    };
    if (config) {
      Object.assign(__styles, config.styles);
    }
    // const newInjector = Injector.create([
    //   {
    //     provide: OverlayRef,
    //     useClass: OverlayRef,
    //     deps: [
    //       {
    //         fnDestroy: this.destroy.bind(this),
    //         ...config,
    //         styles: __styles,
    //       },
    //       this
    //     ]
    //     // <LyOverlayConfig>{
    //     //   fnDestroy: this.destroy.bind(this),
    //     //   ...config,
    //     //   styles: __styles,
    //     // }
    //   }
    // ], this._injector);

    const newInjector = createOverlayInjector(this._injector, {
      fnDestroy: this.destroy.bind(this),
        ...config,
        styles: __styles,
      }, this);

    this._updateStyles(__styles);
    if (config) {
      if (config.onResizeScroll) {
        this.onResizeScroll = config.onResizeScroll;
      }

      this._windowSRSub = merge(windowScroll.scroll$, resizeService.resize$).subscribe(() => {
        if (this.onResizeScroll) {
          this.onResizeScroll();
        }
      });

      if (config.classes) {
        const classes = config.classes;
        classes.forEach((className) => (this._el as HTMLDivElement).classList.add(className));
      }
    }

    if (config.hasBackdrop) {
      this._compRefOverlayBackdrop = this._generateComponent(LyOverlayBackdrop, newInjector);
      this._appRef.attachView(this._compRefOverlayBackdrop.hostView);
      const backdropEl = this._compRefOverlayBackdrop.location.nativeElement;
      this._overlayContainer._add(backdropEl);
    }

    this._appendComponentToBody(_templateRefOrComponent, _context, newInjector);

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
      this._overlayContainer._add(this._el);
    } else if (typeof type === 'string') {
      this._el!.innerText = type;
      this._overlayContainer._add(this._el);
    } else {
      this._compRef = this._generateComponent(type, injector);
      this._appRef.attachView(this._compRef.hostView);
      this._el!.appendChild(this._compRef.location.nativeElement);
      this._overlayContainer._add(this._el);
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
    if (this._compRefOverlayBackdrop) {
      this._appRef.detachView(this._compRefOverlayBackdrop.hostView);
      this._compRefOverlayBackdrop.destroy();
      const backdropEl = this._compRefOverlayBackdrop.location.nativeElement;
      this._overlayContainer._remove(backdropEl);
    }
    this._windowSRSub.unsubscribe();
  }

  /** Detach & remove */
  destroy() {
    this.detach();
    this.remove();
  }
}
