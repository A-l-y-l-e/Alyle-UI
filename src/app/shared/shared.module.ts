import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusComponent } from './status/status.component';
import { LyCommonModule } from '@alyle/ui';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyIconModule
  ],
  exports: [StatusComponent],
  declarations: [StatusComponent]
})
export class SharedModule { }
