import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicTabsComponent } from './basic-tabs.component';
import { LyTabsModule } from '@alyle/ui/tabs';

@NgModule({
  imports: [
    CommonModule,
    LyTabsModule
  ],
  exports: [BasicTabsComponent],
  declarations: [BasicTabsComponent]
})
export class BasicTabsModule { }
