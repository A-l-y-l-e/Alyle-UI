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

// Here we extend the two themes to be able to change their variables.

/**
 * For light theme
 * Theme name = minima-light
 */
export class CustomMinimaLight extends MinimaLight {
  footer = '#24c1a0'; // Footer color
}

/**
 * For dark theme
 * Theme name = minima-dark
 */
export class CustomMinimaDark extends MinimaDark {
  footer = '#70b8e8'; // Footer color
}

/**
 * Global variables
 * This replaces the variables to all the themes,
 * you can also add new variables
 */
export class GlobalVariables implements Partial<ThemeVariables> {
  primary = {
    default: '#3f51b5',
    contrast: '#fff'
  };
  accent = {
    default: '#e91e63',
    contrast: '#fff'
  };
  SublimeLight: {
    default: \`linear-gradient(135deg, \${'#FC5C7D'} 0%,\${'#6A82FB'} 100%)\`,
    contrast: '#fff',
    shadow: '#B36FBC'
  }; // demo: <button ly-button raised bg="SublimeLight">Button</button>
  button: {
    root: {
      borderRadius: '2em'
    }
  }
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

