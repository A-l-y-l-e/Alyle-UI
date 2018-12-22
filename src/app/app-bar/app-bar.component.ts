import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppComponent } from '../app.component';
import { LyTheme2, CoreTheme as ThemeManager, Platform, WinScroll, ThemeVariables } from '@alyle/ui';
import { LyDrawer } from '@alyle/ui/drawer';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const styles = (theme: ThemeVariables) => ({
  root: {
    transition: `all 350ms ${theme.animations.curves.standard}`
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
  }
});

@Component({
  selector: 'aui-app-bar',
  templateUrl: './app-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppBarComponent implements OnInit, OnDestroy {
  classes = this.theme.addStyleSheet(styles, 1);
  themes: Set<string>;
  drawer: LyDrawer;
  bg = 'transparent';
  elevation = 0;
  color = '#fff';
  private scrollSub: Subscription;
  constructor(
    private appComponent: AppComponent,
    public theme: LyTheme2,
    public themeManager: ThemeManager,
    private winScroll: WinScroll,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.themes = themeManager.themes;
  }

  ngOnInit() {
    this.drawer = this.appComponent.drawer;
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe((event: NavigationEnd) => {
      if (event.url === '/') {
        this.setForHomeStyles();
      } else {
        this.setDefaultStyles();
      }
    });
    if (Platform.isBrowser) {
      this.scrollSub = this.winScroll.scroll$.subscribe((val) => {
        if (this.router.url === '/') {
          if (val > 90) {
            this.setDefaultStyles();
          } else {
            this.setForHomeStyles();
          }
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
    this.color = '#fff';
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this.scrollSub.unsubscribe();
    }
  }

}
