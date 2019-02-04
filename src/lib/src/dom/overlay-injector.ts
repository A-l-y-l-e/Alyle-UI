import { Injector } from '@angular/core';
import { OverlayRef } from './overlay-ref';
import { LyOverlayConfig } from './overlay-config';

export function createOverlayInjector(parent: Injector, config: LyOverlayConfig, overlayFactory: any) {
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
