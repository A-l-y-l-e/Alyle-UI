import { NgModule, NgZone, ModuleWithProviders, SkipSelf, Optional, Provider } from '@angular/core';
import { ResponsiveService } from './media.service';
import { MediaDirective } from './media/media.directive';
import { ResponsiveList } from './responsive-list';
export * from './responsive-list';
export * from './media/media.directive';
export * from './media.service';

@NgModule({
  declarations: [MediaDirective],
  exports: [MediaDirective],
  providers: [ResponsiveService]
})
export class ResponsiveModule {

  constructor (@Optional() @SkipSelf() parentModule: ResponsiveModule) {
    if (parentModule) {
      throw new Error(
        'ResponsiveModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(list: ResponsiveList): ModuleWithProviders {
    return {
      ngModule: ResponsiveModule,
      providers: [
        { provide: ResponsiveList, useValue: list }
      ]
    };
  }
}
