import { NgModule }           from '@angular/core';
import { LyButtonModule }     from 'alyle-ui';
import { Example01Component } from './example-01.component';

@NgModule({
  imports: [
    LyButtonModule,
  ],
  exports: [Example01Component],
  declarations: [Example01Component]
})
export class Example01Module { }
