import { ChangeDetectionStrategy, Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
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

  /** Event that is emitted when the autocomplete panel is opened. */
  @Output() readonly opened = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is closed. */
  @Output() readonly closed = new EventEmitter<void>();

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
