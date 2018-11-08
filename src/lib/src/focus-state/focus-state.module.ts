import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyFocusStateDeprecated } from './focus-state.directive';
export * from './focus-state.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LyFocusStateDeprecated],
  exports: [LyFocusStateDeprecated]
})
export class LyFocusStateModule { }
