import { NgModule }           from '@angular/core';
import { LyCommonModule }        from '@alyle/ui';
import { LyButtonModule }     from '@alyle/ui/button';
import { Example01Component } from './example-01.component';

@NgModule({
  imports: [
    LyCommonModule,
    LyButtonModule
  ],
  exports: [Example01Component],
  declarations: [Example01Component]
})
export class Example01Module { }
