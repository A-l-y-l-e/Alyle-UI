import { Injectable, Type, TemplateRef, ComponentFactoryResolver, ComponentFactory, Injector, StaticProvider } from '@angular/core';
import { LyOverlay, LyOverlayRef, LyTheme2, STYLES_BACKDROP_DARK } from '@alyle/ui';

import { LyDialogContainer } from './dialog-container.component';
import { LyDialogRef } from './dialog-ref';
import { DynamicInjector } from './dynamic-injector';
import { LyDialogConfig } from './dialog-config';
import { LY_DIALOG_DATA } from './dialog-data';

@Injectable()
export class LyDialog {

  constructor(
    private _overlay: LyOverlay,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _theme: LyTheme2,
    private _injector: Injector
  ) { }
  open<T, DATA = unknown>(componentOrTemplateRef: Type<T> | TemplateRef<T>,
                          config?: LyDialogConfig<DATA>) {

    // merge with default config
    config = { ...new LyDialogConfig(), ...config };

    let componentFactoryOrTemplate: ComponentFactory<any> | TemplateRef<any>;
    if (componentOrTemplateRef instanceof TemplateRef) {
      componentFactoryOrTemplate = componentOrTemplateRef;
    } else {
      componentFactoryOrTemplate = this._componentFactoryResolver.resolveComponentFactory(componentOrTemplateRef);
    }

    const onReziseScroll = () => {
      // I would have used FlexBox to position, but not,
      // because it creates a blurring effect in the text
      // when the `dialog` is opened
      const dialogContainerElement = overlayRef.containerElement;
      const x = window.innerWidth / 2 - dialogContainerElement.offsetWidth / 2;
      const y = window.innerHeight / 2 - dialogContainerElement.offsetHeight / 2;
      dialogContainerElement.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    };

    const overlayRef = this._overlay.create(LyDialogContainer, null, {
      styles: {
        top: 0,
        left: 0
      },
      hasBackdrop: config.hasBackdrop,
      onResizeScroll: onReziseScroll,
      backdropClass: config.backdropClass || this._theme.style(STYLES_BACKDROP_DARK),
      fnDestroy: () => {
        dialogRef.close();
      }
    });

    const instance: LyDialogContainer = overlayRef.componentRef!.instance;
    const dialogContainerStyle = instance._getHostElement().style;

    dialogContainerStyle.width = toPx(config.width);
    dialogContainerStyle.maxWidth = toPx(config.maxWidth);
    dialogContainerStyle.minWidth = toPx(config.minWidth);
    dialogContainerStyle.height = toPx(config.height);
    dialogContainerStyle.maxHeight = toPx(config.maxHeight);
    dialogContainerStyle.minHeight = toPx(config.minHeight);

    const providers: StaticProvider[] = [
      {
        provide: LyDialogRef,
        useValue: new LyDialogRef(overlayRef.componentRef!.injector.get(LyOverlayRef))
      },
      {
        provide: LyDialogConfig,
        useValue: config
      }
    ];

    if (config.data != null) {
      providers.push({
        provide: LY_DIALOG_DATA,
        useValue: config.data
      });
    }

    const newInjector = new DynamicInjector(
        Injector.create(providers, overlayRef.componentRef!.injector), this._injector);
    instance._init(componentFactoryOrTemplate, newInjector);
    const dialogRef = newInjector.get(LyDialogRef);
    return dialogRef;
  }
}

/**
 * convert number to px
 */
function toPx(val: string | number | undefined | null): string | null {
  if (typeof val === 'number') {
    return `${val}px`;
  } else if (val) {
    return val;
  }

  return null;
}
