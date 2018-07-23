import { NgModule, NgZone, ModuleWithProviders, SkipSelf, Optional, Provider } from '@angular/core';
// import { Responsive } from './media.service';
// import { PLATFORM_ID } from '@angular/core';
import { MediaDirective } from './media/media.directive';

// export function responsiveProviderFactory(
//   parent: Responsive, ngZone: NgZone, platformId: Object): Responsive {
// return parent || new Responsive(ngZone, platformId);
// }

// export const responsiveProvider: Provider = {
//   provide: Responsive,
//   deps: [[new Optional(), new SkipSelf(), Responsive], NgZone, PLATFORM_ID],
//   useFactory: responsiveProviderFactory
// };

@NgModule({
  declarations: [MediaDirective],
  exports: [MediaDirective],
  // providers: [responsiveProvider]
})
export class ResponsiveModule { }
