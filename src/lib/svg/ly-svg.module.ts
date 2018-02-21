import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LySvgComponent } from './ly-svg.component';
import { LySvgService } from './ly-svg.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LySvgComponent],
  declarations: [LySvgComponent],
  providers: [LySvgService]
})
export class LySvgModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LySvgModule,
    };
  }
}
