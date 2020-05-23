import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { LyTheme2, CoreTheme as ThemeManager } from '@alyle/ui';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LyDrawer } from '@alyle/ui/drawer';
import { AppComponent } from '../app.component';
import { AUIThemeVariables } from '../app.module';
import { Ads } from '@shared/ads';
import { Location } from '@angular/common';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { Platform } from '@angular/cdk/platform';

const styles = (theme: AUIThemeVariables) => ({
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
  },
  discordHover: {
    '&:hover ly-icon': {
      color: theme.discord
    }
  }
});

@Component({
  selector: 'aui-app-bar',
  templateUrl: './app-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppBarComponent implements OnInit, OnDestroy {
  classes = this.lyTheme.addStyleSheet(styles, 1);
  themes: string[];
  drawer: LyDrawer;
  bg = 'transparent';
  elevation = 0;
  color: string | number = 0xffffff;

  supportList = [
    {
      label: 'Discord community',
      classes: [this.classes.discordHover],
      icon: 'Discord',
      href: 'https://discord.gg/65hMpAJ' },
    {
      label: 'Report a bug',
      classes: [],
      icon: 'github',
      href: 'https://github.com/A-l-y-l-e/Alyle-UI/issues/new/choose' }
  ];

  private scrollSub: Subscription;
  constructor(
    private appComponent: AppComponent,
    public lyTheme: LyTheme2,
    public themeManager: ThemeManager,
    private _scrollDispatcher: ScrollDispatcher,
    private router: Router,
    private cd: ChangeDetectorRef,
    private _ads: Ads,
    private _location: Location,
    private _viewportRuler: ViewportRuler,
    private _ngZone: NgZone,
    private _platform: Platform
  ) {
    this.themes = Array.from(themeManager.themes)
      // Themes that are used in multiple themes demo
      // that should not be displayed on the menu.
      .filter(nam => !nam.startsWith('new-'));

    this.themes.map(theme => console.log(theme, themeManager.get(theme)));
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
    this._ads.update(this._location.path(true), this.lyTheme);
  }

  ngOnDestroy() {
    if (this._platform.isBrowser) {
      this.scrollSub.unsubscribe();
    }
  }

}
