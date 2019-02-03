import { Injector } from '@angular/core';
import { OverlayRef } from './overlay-ref';
import { OverlayConfig } from './overlay-config';
import { OverlayFactory } from './overlay-factory';

export function createOverlayInjector(parent: Injector, config: OverlayConfig, overlayFactory: OverlayFactory) {
  return Injector.create({
    providers: [
      {
        provide: OverlayRef,
        useValue: new OverlayRef(config, overlayFactory)
      }
    ],
    parent
  });
}
