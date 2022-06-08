import { NgModule, Type } from '@angular/core';
import { WithCustomElementComponent } from '@app/docs/element-registry';
import { AutocompleteSimpleExampleComponent } from './autocomplete-simple-example/autocomplete-simple-example.component';
import { AutocompleteSimpleExampleModule } from './autocomplete-simple-example/autocomplete-simple-example.module';



const elements = [
  AutocompleteSimpleExampleComponent,
];

@NgModule({
  imports: [
    AutocompleteSimpleExampleModule,
  ],
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
