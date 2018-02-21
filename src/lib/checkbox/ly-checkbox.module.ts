import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyCheckbox } from './ly-checkbox/ly-checkbox.component';
import { LyCheckboxService } from './ly-checkbox.service';
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LyCheckbox],
  declarations: [LyCheckbox],
  providers: [LyCheckboxService]
})
export class LyCheckboxModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LyCheckboxModule,
    };
  }
}
