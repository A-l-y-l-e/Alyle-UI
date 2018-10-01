import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemingComponent {
  code = `...
import {
  LyThemeModule,
  LY_THEME,
  LY_THEME_GLOBAL_VARIABLES,
  ThemeVariables
} from '@alyle/ui';

import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';


/**
 * for light theme
 * Theme name = minima-light
 */
export class CustomMinimaLight extends MinimaLight {
  footer = '#24c1a0'; // Footer color
}

/**
 * for dark theme
 * Theme name = minima-dark
 */
export class CustomMinimaDark extends MinimaDark {
  footer = '#70b8e8'; // Footer color
}

/**
 * Global variables
 */
export class GlobalVariables implements Partial<ThemeVariables> {
  primary = {
    default: '#00bcd4',
    contrast: '#fff'
  };
  accent = {
    default: '#FFC107',
    contrast: '#fff'
  };
}

/** set theme */
@NgModule({
  ...
  imports: [
    LyThemeModule.setTheme('minima-dark')
  ],
  provides: [
    ...
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true }, // name minima-light
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true }, // name minima-dark
    { provide: LY_THEME_GLOBAL_VARIABLES, useClass: GlobalVariables } // global variables
  ]
  ...
})
export class AppModule { }
`;

}

