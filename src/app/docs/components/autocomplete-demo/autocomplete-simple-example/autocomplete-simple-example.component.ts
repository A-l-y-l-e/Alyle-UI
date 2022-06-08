import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aui-autocomplete-simple-example',
  templateUrl: './autocomplete-simple-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteSimpleExampleComponent {
  readonly myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
}
