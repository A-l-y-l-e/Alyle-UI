import { NgModule } from '@angular/core';
import { LyButtonModule } from 'alyle-ui';
import { Example02Component } from './example-02.component';

@NgModule({
  imports: [
    LyButtonModule,
  ],
  exports: [Example02Component],
  declarations: [Example02Component]
})
export class Example02Module { }
