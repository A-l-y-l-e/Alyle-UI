import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldWithCdkAutosizeComponent } from './field-with-cdk-autosize.component';
import { LyFieldModule } from '@alyle/ui/field';
import { TextFieldModule } from '@angular/cdk/text-field';



@NgModule({
  declarations: [FieldWithCdkAutosizeComponent],
  imports: [
    CommonModule,
    LyFieldModule,
    TextFieldModule
  ],
  exports: [FieldWithCdkAutosizeComponent]
})
export class FieldWithCdkAutosizeModule { }
