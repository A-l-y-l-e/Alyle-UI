import { NgModule, NgZone, ModuleWithProviders, SkipSelf, Optional, Provider } from '@angular/core';
import { ResponsiveService } from './media.service';
import { MediaDirective } from './media/media.directive';
import { ResponsiveList } from './responsive-list';
export * from './responsive-list';
export * from './media/media.directive';
export * from './media.service';

export function MEDIA_PROVIDER_FACTORY(parent: ResponsiveService, list: ResponsiveList, zone: NgZone): ResponsiveService {
  return parent || new ResponsiveService(list, zone);
}

export const MEDIA_PROVIDER: Provider = {
  provide: ResponsiveService, // service
  deps: [[new Optional(), new SkipSelf(), ResponsiveService]],
  useFactory: MEDIA_PROVIDER_FACTORY,
};

@NgModule({
  // imports: [],
  declarations: [MediaDirective],
  exports: [MediaDirective],
  providers: [ResponsiveService]
})
export class ResponsiveModule {
  static forRoot(list: ResponsiveList): ModuleWithProviders {
    return {
      ngModule: ResponsiveModule,
      providers: [
        { provide: ResponsiveList, useValue: list },
      ],
    };
  }
}
