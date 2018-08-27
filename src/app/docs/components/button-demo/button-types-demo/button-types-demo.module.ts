import { NgModule } from '@angular/core';
import { ButtonTypesDemoComponent } from './button-types-demo.component';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  imports: [
    LyButtonModule
  ],
  exports: [ButtonTypesDemoComponent],
  declarations: [ButtonTypesDemoComponent]
})
export class ButtonTypesDemoModule { }
