import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from 'alyle-ui/core';

import { ThemingRoutingModule } from './theming-routing.module';
import { ThemingComponent } from './theming/theming.component';
import { PrismModule } from '../../core/prism/prism.module';

@NgModule({
  imports: [
    CommonModule,
    ThemingRoutingModule,
    PrismModule,
    ThemeModule,
    FormsModule
  ],
  declarations: [ThemingComponent]
})
export class ThemingModule { }
