import { Injectable } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = -2;

const styles = ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  labelContent: {
    padding: '0 0.5em'
  }
});

@Injectable({
  providedIn: 'root'
})
export class LyRadioService {
  classes = this.theme.addStyleSheet(styles, 'lyRadioStatic', STYLE_PRIORITY);
  constructor(
    private theme: LyTheme2
  ) { }
}
