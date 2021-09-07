import { Injectable, Type, TemplateRef, ComponentFactoryResolver, ComponentFactory, Injector, StaticProvider } from '@angular/core';
import { LyOverlay, LyOverlayRef, LyTheme2, STYLES_BACKDROP_DARK, createStyle, LyStyle, MediaQueryArray } from '@alyle/ui';

import { LyDialogContainer } from './dialog-container.component';
import { LyDialogRef } from './dialog-ref';
import { DynamicInjector } from './dynamic-injector';
import { LyDialogConfig } from './dialog-config';
import { LY_DIALOG_DATA } from './dialog-data';

const dialogContainerStyleProperties = [
  'width',
  'maxWidth',
  'minWidth',
  'height',
  'maxHeight',
  'minHeight',
];

@Injectable()
export class LyDialog {

  constructor(
    private _overlay: LyOverlay,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _theme: LyTheme2,
    private _injector: Injector
  ) { }
  open<T, DATA = unknown>(componentOrTemplateRef: Type<T> | TemplateRef<T>,
                          config?: LyDialogConfig<DATA>): LyDialogRef {

    // merge with default config
    config = { ...new LyDialogConfig(), ...config };

    let componentFactoryOrTemplate: ComponentFactory<any> | TemplateRef<any>;
    if (componentOrTemplateRef instanceof TemplateRef) {
      componentFactoryOrTemplate = componentOrTemplateRef;
    } else {
      componentFactoryOrTemplate = this._componentFactoryResolver.resolveComponentFactory(componentOrTemplateRef);
    }

    const noop = () => {};

    const overlayRef = this._overlay.create(LyDialogContainer, null, {
      styles: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      hasBackdrop: config.hasBackdrop,
      onResizeScroll: noop,
      disableClose: config.disableClose,
      backdropClass: config.backdropClass || this._theme.style(STYLES_BACKDROP_DARK),
      fnDestroy: () => {
        dialogRef.close();
      }
    });

    const instance: LyDialogContainer = overlayRef.componentRef!.instance;

    dialogContainerStyleProperties.forEach(property => {
      if (config![property]) {
        createStyle<string | MediaQueryArray | number | null, LyDialogContainer>(
          instance,
          { key: property, и: LyStyle.и },
          config![property],
          LyStyle[property],
          LyStyle.$priority
        );
      }
    });

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

