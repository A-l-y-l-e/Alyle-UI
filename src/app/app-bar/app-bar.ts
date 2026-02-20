import { Component, OnInit, ChangeDetectionStrategy, afterNextRender, ViewEncapsulation, OnDestroy, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { lyl, LyTheme2, StyleRenderer, CoreTheme as ThemeManager } from '@alyle/ui';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LyDrawer } from '@alyle/ui/drawer';
import { App } from '../app';
import { AUIThemeVariables } from '../app.config';
import { Location, NgClass } from '@angular/common';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { Platform } from '@angular/cdk/platform';
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbar, LyToolbarModule } from '@alyle/ui/toolbar';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyIconModule } from '@alyle/ui/icon';

// const styles = (theme: AUIThemeVariables) => ({
//   root: {
//     transition: `350ms ${theme.animations.curves.standard}`,
//     transitionProperty: 'background, color',
//     width: '100vw',
//     paddingRight: '32px',
//     left: 0
//   },
//   themePickerText: {
//     paddingBefore: '8px'
//   },
//   logo: {
//     height: '64px',
//     borderRadius: 0,
//     fontSize: '20px'
//   },
//   version: {
//     fontSize: '71%',
//     opacity: .71
//   },
//   supportMenuIcon: {
//     paddingAfter: '16px'
//   },
//   discordHover: {
//     '&:hover ly-icon': {
//       color: theme.discord
//     }
//   }
// });

const STYLES = (theme: AUIThemeVariables) => {
  const { before, after } = theme;
  return {
    toolbar: lyl `{
      width: 100vw
      padding-right: 32px
      left: 0
      transition: 350ms ${theme.animations.curves.standard}
      transition-property: background, color
    }`,
    themePickerText: lyl `{
      padding-${before}: '8px'
    }`,
    logo: lyl `{
      height: 64px
      border-radius: 0
      font-size: 20px
    }`,
    version: lyl `{
      font-size: 71%
      opacity: .71
    }`,
    supportMenuIcon: lyl `{
      padding-${after}: 16px
    }`,
    discordHover: lyl `{
      &:hover ly-icon {
        color: ${theme.discord}
      }
    }`
  }
};

@Component({
  selector: 'aui-app-bar',
  templateUrl: './app-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    LyButtonModule,
    LyToolbarModule,
    LyMenuModule,
    LyIconModule,
    NgClass,
    RouterLink,
  ],
  providers: [
    StyleRenderer
  ]
})
export class AppBar implements OnInit, OnDestroy {
  // classes = this.lyTheme.addStyleSheet(styles, 1);
  $$ = this.sRenderer.renderSheet(STYLES);
  themes: string[];
  drawer!: LyDrawer;
  get bg() { return this._bg; }
  set bg(value: string) { this._bg = value;};
  private _bg = 'transparent';
  elevation = 0;
  color: string | number = 0xffffff;

  supportList = [
    {
      label: 'Discord community',
      classes: [this.$$.discordHover],
      icon: 'Discord',
      href: 'https://discord.gg/65hMpAJ' },
    {
      label: 'Report a bug',
      classes: [],
      icon: 'github',
      href: 'https://github.com/A-l-y-l-e/Alyle-UI/issues/new/choose' }
  ];

  private scrollSub!: Subscription;

  @ViewChild(LyToolbar) readonly toolbar!: LyToolbar;
  constructor(
    private appComponent: App,
    public lyTheme: LyTheme2,
    public themeManager: ThemeManager,
    private _scrollDispatcher: ScrollDispatcher,
    private router: Router,
    private cd: ChangeDetectorRef,
    private _location: Location,
    private _viewportRuler: ViewportRuler,
    private _ngZone: NgZone,
    private _platform: Platform,
    readonly sRenderer: StyleRenderer
  ) {
    afterNextRender({
      write: () => {
        const pathname = location.pathname;
        if (pathname === '/' || pathname === '') {
          this.setForHomeStyles();
        } else {
          this.setDefaultStyles();
        }
        return true;
      }
    });
    this.themes = Array.from(themeManager.themes)
      // Themes that are used in multiple themes demo
      // that should not be displayed on the menu.
      .filter(nam => !nam.startsWith('new-'));
  }

  ngOnInit() {
    this.drawer = this.appComponent.drawer;
    this.router.events
    .pipe(
      filter((event) => {
        return event instanceof NavigationEnd;
      })
    )
    .subscribe(() => {
      const pathname = this._location.path();
      if (pathname === '/' || pathname === '') {
        this.setForHomeStyles();
      } else {
        this.setDefaultStyles();
      }
    });
    if (this._platform.isBrowser) {
      this.scrollSub = this._scrollDispatcher.scrolled().subscribe(() => {
        if (this.router.url === '/' || this.router.url === '') {
          const viewportScrollPositionTop = this._viewportRuler.getViewportScrollPosition().top;
          this._ngZone.run(() => {
            if (viewportScrollPositionTop > 90) {
              this.setDefaultStyles();
            } else {
              this.setForHomeStyles();
            }
          });
        }
      });
    }
  }

  private setDefaultStyles() {
    this.bg = 'primary';
    this.elevation = 3;
    this.color = 'primary:contrast';
    this.cd.markForCheck();
  }
  private setForHomeStyles() {
    this.bg = 'transparent';
    this.elevation = 0;
    this.color = 0xffffff;
    this.cd.markForCheck();
  }

  setTheme(themeName: string) {
    if (typeof localStorage === 'object') {
      localStorage.setItem('theme-name', themeName);
    }
    this.lyTheme.setTheme(themeName);
  }

  ngOnDestroy() {
    if (this._platform.isBrowser) {
      this.scrollSub.unsubscribe();
    }
  }

}
