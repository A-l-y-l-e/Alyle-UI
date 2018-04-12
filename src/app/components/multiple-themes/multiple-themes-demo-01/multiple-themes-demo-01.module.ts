import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleThemesDemo01Component } from './multiple-themes-demo-01.component';
import { AlyleUIModule } from 'alyle-ui';

@NgModule({
  imports: [
    CommonModule,
    AlyleUIModule.forRoot({
      primary: 'pink',
      accent: 'purple',
      colorScheme: 'light',
      palette: {
        pink: '#ff4b73',
        purple: '#ce30c9'
      }
    })
  ],
  declarations: [MultipleThemesDemo01Component],
  exports: [MultipleThemesDemo01Component]
})
export class MultipleThemesDemo01Module { }
