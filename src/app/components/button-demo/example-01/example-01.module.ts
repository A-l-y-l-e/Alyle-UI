import { NgModule }           from '@angular/core';
import { LyCoreModule }     from 'alyle-ui/core';
import { LyButtonModule }     from 'alyle-ui/button';
import { Example01Component } from './example-01.component';

@NgModule({
  imports: [
    LyButtonModule,
    LyCoreModule
  ],
  exports: [Example01Component],
  declarations: [Example01Component]
})
export class Example01Module { }
