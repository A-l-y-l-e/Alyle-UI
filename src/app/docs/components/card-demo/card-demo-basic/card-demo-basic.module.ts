import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDemoBasicComponent } from './card-demo-basic.component';
import { LyCardModule } from '@alyle/ui/card';

@NgModule({
  imports: [
    CommonModule,
    LyCardModule
  ],
  exports: [CardDemoBasicComponent],
  declarations: [CardDemoBasicComponent]
})
export class CardDemoBasicModule { }
