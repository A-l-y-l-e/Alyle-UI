import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { StyleRenderer } from '@alyle/ui';
import { STYLES as AUTOCOMPLETE_STYLES } from './autocomplete-styles';

@Component({
  selector: 'ly-autocomplete',
  templateUrl: 'autocomplete.html',
  exportAs: 'lyAutocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class LyAutocomplete {
  readonly classes = this.sRenderer.renderSheet(AUTOCOMPLETE_STYLES);

  /** @docs-private */
  @ViewChild(TemplateRef, { static: true }) readonly template: TemplateRef<any>;

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
