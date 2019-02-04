// import { Injectable } from '@angular/core';
import { LyOverlayConfig } from './overlay-config';
import { OverlayFactoryRef } from './overlay-factory';

// @Injectable()
export class OverlayRef {
  constructor(
    public config: LyOverlayConfig,
    public ref: OverlayFactoryRef
  ) { }
}
