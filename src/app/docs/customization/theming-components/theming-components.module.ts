import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemingComponentsComponent } from './theming-components.component';

@NgModule({
  declarations: [ThemingComponentsComponent],
  imports: [
    CommonModule
  ],
  exports: [ThemingComponentsComponent]
})
export class ThemingComponentsModule { }
