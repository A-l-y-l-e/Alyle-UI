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
  PartialThemeVariables,
  Dir
} from '@alyle/ui';

import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

// Here we extend the two themes to be able to change their variables.

/**
 * For light theme
 * Theme name = minima-light
 */
export class CustomMinimaLight extends MinimaLight {
  primary = {
    default: '#2196f3',
    contrast: '#fff'
  };
  accent = {
    default: '#e91e63',
    contrast: '#fff'
  };
}

/**
 * For dark theme
 * Theme name = minima-dark
 */
export class CustomMinimaDark extends MinimaDark {
  primary = {
    default: '#9C27B0',
    contrast: '#fff'
  };
  accent = {
    default: '#69F0AE',
    contrast: '#202020'
  };
}

/**
 * Global variables
 * This replaces the variables to all the themes,
 * you can also add new variables
 */
export class GlobalVariables implements PartialThemeVariables {
  SublimeLight = {
    default: \`linear-gradient(135deg, \${'#FC5C7D'} 0%,\${'#6A82FB'} 100%)\`,
    contrast: '#fff',
    shadow: '#B36FBC'
  }; // demo: <button ly-button raised bg="SublimeLight">Button</button>
  button = {
    root: {
      borderRadius: '2em'
    }
  };
  // direction = Dir.rtl;
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

