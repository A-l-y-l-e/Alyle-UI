import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LySkeletonModule } from '@alyle/ui/skeleton';

import { BasicSkeletonComponent } from './basic-skeleton.component';

@NgModule({
  declarations: [BasicSkeletonComponent],
  imports: [
    CommonModule,
    LyCommonModule,
    LyTypographyModule,
    LySkeletonModule
  ],
  exports: [BasicSkeletonComponent]
})
export class BasicSkeletonModule { }
