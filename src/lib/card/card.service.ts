import { Injectable } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = {
  root: {
    display: 'block',
    overflow: 'hidden'
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
  classes: {
    root: string,
    content: string,
    actions: string,
    actionsItem: string,
  };
  constructor(
    theme: LyTheme2
  ) {
    this.classes = theme.addStyleSheet(styles, 'lyCard');
  }
}
