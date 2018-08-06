import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsWithLazyLoadingComponent } from './tabs-with-lazy-loading.component';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    LyTabsModule,
    LyCommonModule,
    LyTypographyModule
  ],
  exports: [TabsWithLazyLoadingComponent],
  declarations: [TabsWithLazyLoadingComponent]
})
export class TabsWithLazyLoadingModule { }
