import { NgModule, NgZone, ModuleWithProviders, SkipSelf, Optional, Provider } from '@angular/core';
import { Responsive } from './media.service';
import { MediaDirective } from './media/media.directive';

export function responsiveProviderFactory(
  parent: Responsive, ngZone: NgZone): Responsive {
return parent || new Responsive(ngZone);
}

export const responsiveProvider: Provider = {
  provide: Responsive,
  deps: [[new Optional(), new SkipSelf(), Responsive], NgZone],
  useFactory: responsiveProviderFactory
};

@NgModule({
  declarations: [MediaDirective],
  exports: [MediaDirective],
  providers: [responsiveProvider]
})
export class ResponsiveModule { }
