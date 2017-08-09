import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrismPipe } from '../pipes/prism/prism.pipe';
import { PrismDirective } from './prism.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [PrismPipe, PrismDirective],
  declarations: [PrismPipe, PrismDirective],
  providers: [PrismPipe]
})
export class PrismModule { }
