import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyAutocomplete } from './autocomplete';
import { LyAutocompleteTrigger } from './autocomplete-trigger';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  declarations: [
    LyAutocomplete,
    LyAutocompleteTrigger
  ],
  exports: [
    LyCommonModule,
    LyAutocomplete,
    LyAutocompleteTrigger
  ],
})
export class LyAutocompleteModule { }
