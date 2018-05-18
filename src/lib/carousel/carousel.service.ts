import { Injectable } from '@angular/core';
import { Observable ,  of as observableOf } from 'rxjs';
import { LyTheme, ProvidedInTheme } from '@alyle/ui';
@Injectable(ProvidedInTheme)
export class CarouselService {
  classes = {
    root: this.theme.setStyle(
      'carousel',
      () => (
        ``
      )
    )
  };
  constructor(private theme: LyTheme) { }

}
