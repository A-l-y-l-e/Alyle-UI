import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LyAutocompleteModule } from '@alyle/ui/autocomplete';

import { AutocompleteSimpleExampleComponent } from './autocomplete-simple-example.component';



@NgModule({
  declarations: [
    AutocompleteSimpleExampleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyFieldModule,
    LyAutocompleteModule
  ]
})
export class AutocompleteSimpleExampleModule { }
