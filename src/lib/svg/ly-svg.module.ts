import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LySvgComponent } from './ly-svg.component';
import { LySvgService } from './ly-svg.service';
export * from './ly-svg.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
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
