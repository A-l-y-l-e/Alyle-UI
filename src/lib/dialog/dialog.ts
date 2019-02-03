import { Injectable, Type, TemplateRef, ComponentFactoryResolver, ComponentFactory, Injector } from '@angular/core';
import { LyOverlay, OverlayRef } from '@alyle/ui';

import { LyDialogContainer } from './dialog-container.component';
import { LyDialogRef } from './dialog-ref';
import { DynamicInjector } from './dynamic-injector';

@Injectable()
export class LyDialog {
  constructor(
    private _overlay: LyOverlay,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) { }
  open<T>(componentOrTemplateRef: Type<T> | TemplateRef<T>) {
    let componentFactoryOrTemplate: ComponentFactory<any> | TemplateRef<any>;
    if (componentOrTemplateRef instanceof TemplateRef) {
      componentFactoryOrTemplate = componentOrTemplateRef;
    } else {
      componentFactoryOrTemplate = this._componentFactoryResolver.resolveComponentFactory(componentOrTemplateRef);
    }

    const overlayRef = this._overlay.create(LyDialogContainer, null, {
      styles: {
        top: 0,
        left: 0
      },
      backdrop: true,
      fnDestroy: () => {
        newInjector.get(LyDialogRef).close();
      }
    });
    const instance: LyDialogContainer = overlayRef.componentRef!.instance;
    const newInjector = new DynamicInjector(Injector.create([
      {
        provide: LyDialogRef,
        useValue: new LyDialogRef(overlayRef.componentRef!.injector.get(OverlayRef))
      }
    ], overlayRef.componentRef!.injector), overlayRef.componentRef!.injector);
    instance._init(componentFactoryOrTemplate, newInjector);
    const dialogRef = newInjector.get(LyDialogRef);
    return dialogRef;
  }
}
