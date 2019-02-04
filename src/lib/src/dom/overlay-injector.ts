import { Injector } from '@angular/core';
import { LyOverlayRef } from './overlay-ref';
import { LyOverlayConfig } from './overlay-config';

export function createOverlayInjector(parent: Injector, config: LyOverlayConfig, overlayFactory: any) {
  return Injector.create({
    providers: [
      {
        provide: LyOverlayConfig,
        useValue:  config
      },
      {
        provide: LyOverlayRef,
        useValue:  overlayFactory
      }
    ],
    parent
  });
}
