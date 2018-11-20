import { NgModule } from '@angular/core';
import { ButtonTypesDemoComponent } from './button-types-demo.component';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyTypographyModule } from '@alyle/ui/typography';

@NgModule({
  imports: [
    LyButtonModule,
    LyIconModule,
    LyTypographyModule
  ],
  exports: [ButtonTypesDemoComponent],
  declarations: [ButtonTypesDemoComponent]
})
export class ButtonTypesDemoModule { }
