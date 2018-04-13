import { NgModule }           from '@angular/core';
import { ThemeModule }        from 'alyle-ui/core';
import { LyButtonModule }     from 'alyle-ui/button';
import { Example01Component } from './example-01.component';

@NgModule({
  imports: [
    ThemeModule,
    LyButtonModule
  ],
  exports: [Example01Component],
  declarations: [Example01Component]
})
export class Example01Module { }
