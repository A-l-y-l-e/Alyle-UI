import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from 'alyle-ui/core';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { IconButtonExample01Component } from './icon-button-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    LyIconButtonModule
  ],
  exports: [IconButtonExample01Component],
  declarations: [IconButtonExample01Component]
})
export class IconButtonExample01Module { }
