import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyListModule } from '@alyle/ui/list';
import { LyAvatarModule } from '@alyle/ui/avatar';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDividerModule } from '@alyle/ui/divider';

import { InsetDividersComponent } from './inset-dividers.component';

@NgModule({
  imports: [
    CommonModule,
    LyListModule,
    LyAvatarModule,
    LyIconModule,
    LyDividerModule
  ],
  exports: [InsetDividersComponent],
  declarations: [InsetDividersComponent]
})
export class InsetDividersModule { }
