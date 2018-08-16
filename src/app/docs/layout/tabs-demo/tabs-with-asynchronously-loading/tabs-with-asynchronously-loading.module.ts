import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsWithAsynchronouslyLoadingComponent } from './tabs-with-asynchronously-loading.component';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyCommonModule } from '@alyle/ui';
import { LyTypographyModule } from '@alyle/ui/typography';

@NgModule({
  imports: [
    CommonModule,
    LyTabsModule,
    LyCommonModule,
    LyTypographyModule
  ],
  exports: [TabsWithAsynchronouslyLoadingComponent],
  declarations: [TabsWithAsynchronouslyLoadingComponent]
})
export class TabsWithAsynchronouslyLoadingModule { }
