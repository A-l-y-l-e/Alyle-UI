import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDemoBasicComponent } from './card-demo-basic.component';
import { LyCardModule } from '@alyle/ui/card';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  imports: [
    CommonModule,
    LyCardModule,
    LyTypographyModule,
    LyButtonModule
  ],
  exports: [CardDemoBasicComponent],
  declarations: [CardDemoBasicComponent]
})
export class CardDemoBasicModule { }
