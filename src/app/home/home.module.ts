import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyButtonModule } from '@alyle/ui/button';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyButtonModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
