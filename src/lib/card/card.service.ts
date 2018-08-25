import { Injectable } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = {
  root: {
    display: 'block',
    overflow: 'hidden',
    borderRadius: '2px'
  },
  content: {
    display: 'block',
    padding: '16px 24px'
  },
  actions: {
    display: 'block',
    padding: '8px 12px'
  },
  actionsItem: {
    margin: '0 4px'
  }
};

@Injectable({ providedIn: 'root' })
export class LyCardService {
  classes = this.theme.addStyleSheet(styles, 'lyCard');
  constructor(
    private theme: LyTheme2
  ) { }
}
