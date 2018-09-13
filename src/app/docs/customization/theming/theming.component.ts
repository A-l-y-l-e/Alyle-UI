import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemingComponent {
  code = `...
import { LyThemeModule, LyThemeConfig, LY_THEME_CONFIG, PartialThemeConfig } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';


/**
 * for light theme
 * Theme name = minima-light
 */
export class CustomMinimaLight extends MinimaLight {
  footer = '#24c1a0'; // Footer color
  myColor = 'pink';
}

/**
 * for dark theme
 * Theme name = minima-dark
 */
export class CustomMinimaDark extends MinimaDark {
  footer = '#70b8e8'; // Footer color
  myColor = 'teal';
}

/**
 * Global variables
 */
export class GlobalVariables implements PartialThemeConfig {
  primary = {
    default: '#00bcd4',
    contrast: '#fff'
  },
  accent = {
    default: '#FFC107',
    contrast: '#fff'
  }
}

/** Add theme */
export class MyCustomTheme implements LyThemeConfig {
  themes = [CustomMinimaLight, CustomMinimaDark];
  /** overwrite for light & dark */
  variables = new GlobalVariables;
}

/** set theme */
@NgModule({
  ...
  imports: [
    LyThemeModule.setTheme('minima-dark')
  ],
  provides: [
    { provide: LY_THEME_CONFIG, useClass: MyCustomTheme }
  ]
  ...
})
export class AppModule { }
`;

}

