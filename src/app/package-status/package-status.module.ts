import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageStatusComponent } from './package-status.component';
import { LyCommonModule } from '@alyle/ui';
import { LyIconModule } from '@alyle/ui/icon';
import { LyCardModule } from '@alyle/ui/card';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyCardModule,
    LyIconModule
  ],
  exports: [PackageStatusComponent],
  declarations: [PackageStatusComponent]
})
export class PackageStatusModule { }
