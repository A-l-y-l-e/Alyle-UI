import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithThemeVariablesComponent } from './with-theme-variables.component';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [WithThemeVariablesComponent],
  declarations: [WithThemeVariablesComponent]
})
export class WithThemeVariablesModule { }
