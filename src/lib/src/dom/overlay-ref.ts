// import { Injectable } from '@angular/core';
import { OverlayConfig } from './overlay-config';
import { OverlayFactoryRef } from './overlay-factory';
// import { OverlayFactory } from './overlay-factory';

// @Injectable()
export class OverlayRef {
  constructor(
    public config: OverlayConfig,
    public ref: OverlayFactoryRef
  ) { }
}
