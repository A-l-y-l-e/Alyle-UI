import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomService } from './dom.service';

// export function LY_OVERLAY_CONTAINER_PROVIDER_FACTORY(parentContainer: LyOverlayContainer) {
//   return parentContainer || new LyOverlayContainer();
// }

// export const LY_OVERLAY_CONTAINER_PROVIDER = {
//   // If there is already an OverlayContainer available, use that. Otherwise, provide a new one.
//   provide: LyOverlayContainer,
//   deps: [[new Optional(), new SkipSelf(), LyOverlayContainer]],
//   useFactory: LY_OVERLAY_CONTAINER_PROVIDER_FACTORY
// };

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DomService
    // LY_OVERLAY_CONTAINER_PROVIDER
  ]
})
export class LxDomModule { }
