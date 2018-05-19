import { Injectable } from '@angular/core';
import { AlyleUIModule } from '../alyle-ui.module';
import { LyTheme } from '../theme.service';

@Injectable({ providedIn: AlyleUIModule })
export class LyThemeStyles {
  classes = {};
  constructor(private theme: LyTheme) { }
}

@Injectable({ providedIn: 'root' })
export class LyGlobalStyles {
  classes = {
    /** Position absolute */
    Absolute: this.theme.setRootStyle(
      'Absolute',
      () => (
        `position: absolute;` +
        `top: 0;` +
        `bottom: 0;` +
        `left: 0;` +
        `right: 0;`
      )
    )
  };
  constructor(private theme: LyTheme) { }
}
