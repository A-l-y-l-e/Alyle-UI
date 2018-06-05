import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildThemeRoutingModule } from './child-theme-routing.module';
import { ChildThemeComponent } from './child-theme.component';
import { AlyleUIModule, LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    ChildThemeRoutingModule
  ],
  declarations: [ChildThemeComponent]
})
export class ChildLyCommonModule { }
