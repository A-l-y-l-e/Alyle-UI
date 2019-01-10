import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrismDirective } from './prism.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [PrismDirective],
  declarations: [PrismDirective]
})
export class PrismModule { }
