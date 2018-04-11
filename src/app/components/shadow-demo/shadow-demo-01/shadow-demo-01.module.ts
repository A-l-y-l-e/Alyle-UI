import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowDemo01Component } from './shadow-demo-01.component';
import { LyShadowModule } from 'alyle-ui/shadow';

@NgModule({
  imports: [
    CommonModule,
    LyShadowModule
  ],
  declarations: [ShadowDemo01Component],
  exports: [ShadowDemo01Component]
})
export class ShadowDemo01Module { }
