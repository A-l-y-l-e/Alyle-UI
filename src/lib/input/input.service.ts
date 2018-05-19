import { Injectable } from '@angular/core';
import { LyTheme, ProvidedInTheme } from '@alyle/ui';

@Injectable(ProvidedInTheme)
export class InputService {
  classes = { };
  constructor(
    private theme: LyTheme
  ) { }
}
