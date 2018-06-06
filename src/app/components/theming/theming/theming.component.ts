import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
  styleUrls: ['./theming.component.css']
})
export class ThemingComponent implements OnInit {
  code: string;
  constructor() {
    this.code = code;
  }

  /**
   * TODO: get all color from lyTheme
   */
  colors() {

  }

  ngOnInit() {
  }

}

const code = `
...
import { LyThemeConfig, LY_THEME_CONFIG } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

/** My custom theme */

export class CustomMinimaLight extends MinimaLight {
  footer = '#24c1a0'; // Footer color
  myColor = 'pink';
}

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
  provides: [
    { provide: LY_THEME_CONFIG, useClass: MyCustomTheme }
  ]
  ...
})
export class AppModule { }

`;
