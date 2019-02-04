import { Injector } from '@angular/core';
import { OverlayRef } from './overlay-ref';
import { LyOverlayConfig } from './overlay-config';
import { OverlayFactoryRef } from './overlay-factory';

export function createOverlayInjector(parent: Injector, config: LyOverlayConfig, overlayFactory: OverlayFactoryRef) {
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
