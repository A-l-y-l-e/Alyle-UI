import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { LyTheme2, CoreTheme as ThemeManager, ThemeVariables } from '@alyle/ui';

const styles = (theme: ThemeVariables) => ({
  root: {
    transition: `350ms ${theme.animations.curves.standard}`,
    transitionProperty: 'background, color',
    width: '100vw',
    paddingRight: '32px',
    left: 0
  },
  themePickerText: {
    paddingBefore: '8px'
  },
  logo: {
    height: '64px',
    borderRadius: 0,
    fontSize: '20px'
  },
  version: {
    fontSize: '71%',
    opacity: .71
  },
  supportMenuIcon: {
    paddingAfter: '16px'
  }
});

@Component({
  selector: 'app-bar',
  templateUrl: './app-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppBarComponent implements OnInit {
  classes = this.lyTheme.addStyleSheet(styles, 1);
  themes: string[];
  bg = 'transparent';
  elevation = 0;
  color: string | number = 0xffffff;

  supportList = [
    {
      label: 'Discord community',
      icon: 'Discord',
      href: 'https://discord.gg/65hMpAJ' },
    {
      label: 'Report a bug',
      icon: 'Github',
      href: 'https://github.com/A-l-y-l-e/Alyle-UI/issues/new/choose' }
  ];

  constructor(
    public lyTheme: LyTheme2,
    public themeManager: ThemeManager
  ) {
    this.themes = Array.from(themeManager.themes)
      // Themes that are used in multiple themes demo
      // that should not be displayed on the menu.
      .filter(nam => !nam.startsWith('new-'));
  }

  ngOnInit() { }

  setTheme(themeName: string) {
    this.lyTheme.setTheme(themeName);
  }

}
