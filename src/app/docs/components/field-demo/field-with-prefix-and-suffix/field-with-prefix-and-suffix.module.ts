import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LyGridModule } from '@alyle/ui/grid';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';

import { FieldWithPrefixAndSuffixComponent } from './field-with-prefix-and-suffix.component';



@NgModule({
  declarations: [FieldWithPrefixAndSuffixComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyFieldModule,
    LyGridModule,
    LyButtonModule,
    LyIconModule
  ]
})
export class FieldWithPrefixAndSuffixModule { }
