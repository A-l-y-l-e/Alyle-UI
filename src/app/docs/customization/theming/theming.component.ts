import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemingComponent {
  code = `...
import { LyThemeModule, LyThemeConfig, LY_THEME_CONFIG } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';


/**
 * Theme name = minima-light
 */
export class CustomMinimaLight extends MinimaLight {
  footer = '#24c1a0'; // Footer color
  myColor = 'pink';
}

/**
 * Theme name = minima-dark
 */
export class CustomMinimaDark extends MinimaDark {
  footer = '#70b8e8'; // Footer color
  myColor = 'teal';
}

/** Add theme */
export class MyCustomTheme extends LyThemeConfig {
  themes = [CustomMinimaLight, CustomMinimaDark];
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

