import { Injectable } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

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
  classes = this.theme.addStyleSheet(styles, 'lyRadioStatic');
  constructor(
    private theme: LyTheme2
  ) { }
}
