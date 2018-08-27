import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicTabsComponent } from '@docs/layout/tabs-demo/basic-tabs/basic-tabs.component';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  imports: [
    CommonModule,
    LyTabsModule,
    LyTypographyModule,
    LyButtonModule
  ],
  exports: [BasicTabsComponent],
  declarations: [BasicTabsComponent]
})
export class BasicTabsModule { }
