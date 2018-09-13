import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { CardDemoBasicComponent } from './card-demo-basic.component';
import { LyCardModule } from '@alyle/ui/card';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyCardModule,
    LyTypographyModule,
    LyButtonModule,
    LyIconButtonModule,
    LyIconModule
  ],
  exports: [CardDemoBasicComponent],
  declarations: [CardDemoBasicComponent]
})
export class CardDemoBasicModule { }
