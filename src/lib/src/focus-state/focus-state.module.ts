import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyFocusState } from './focus-state.directive';
export * from './focus-state.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LyFocusState],
  exports: [LyFocusState]
})
export class LyFocusStateModule { }
