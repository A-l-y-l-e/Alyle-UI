import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildThemeComponent } from './child-theme.component';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  declarations: [ChildThemeComponent]
})
export class ChildLyCommonModule { }
