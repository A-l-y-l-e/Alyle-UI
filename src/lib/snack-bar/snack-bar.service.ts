import { Injectable } from '@angular/core';
import { LySnackBarRef } from './snack-bar-ref';

@Injectable({
  providedIn: 'root'
})
export class LySnackBarService {
  /** @docs-private */
  _currentSnackBar: LySnackBarRef;
}
