import { Directive, Inject } from '@angular/core';
import { StyleRenderer, WithStyles } from '@alyle/ui';
import { LY_FIELD_STYLES_TOKEN } from './field-styles-token';

/**
 * Only show when input is not focused, and hides input`.
 * You can use it to display formatted values.
 */
@Directive({
  selector: 'ly-display-with',
  providers: [
    StyleRenderer
  ],
  standalone: false
})
export class LyDisplayWith implements WithStyles {
  constructor(
    readonly sRenderer: StyleRenderer,
    @Inject(LY_FIELD_STYLES_TOKEN) styles: any
  ) {
    sRenderer.renderSheet(styles, 'displayWith');
  }
}
