import { NgModule, ModuleWithProviders } from '@angular/core';
import { LyDeepComponent } from './deep';
import { LyShadowService }    from './shadow.service';
export *    from './shadow.service';
export *    from './deep';

@NgModule({
  declarations: [LyDeepComponent],
  exports: [LyDeepComponent],
  providers: [LyShadowService]
})
export class LyShadowModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LyShadowModule,
      providers: [LyShadowService],
    };
  }
}
