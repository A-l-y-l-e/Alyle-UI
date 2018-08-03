import { Injectable } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

@Injectable({ providedIn: 'root' })
export class LyCardClasses {
  cardContent = this.theme.setUpStyleSecondary(
    'k-card-content',
    () => (
      `display:block;` +
      `padding:16px 24px;`
    )
  );
  cardActions = this.theme.setUpStyleSecondary(
    'k-card-actions',
    () => (
      `display: block;` +
      `padding: 8px 12px;`
    )
  );
  cardActionsItem = this.theme.setUpStyleSecondary(
    'k-card-actions-item',
    () => (
      `margin: 0 4px;`
    )
  );
  constructor(
    private theme: LyTheme2
  ) { }
}
