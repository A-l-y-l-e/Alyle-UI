import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyButtonModule } from 'alyle-ui/button';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
    LyButtonModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
