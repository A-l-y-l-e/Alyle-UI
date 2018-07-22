import { Component, ViewChild, VERSION, ChangeDetectionStrategy, Inject, OnDestroy} from '@angular/core';
import { environment } from './../environments/environment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AUI_VERSION, LyTheme2, LyThemeContainer, Platform } from '@alyle/ui';
import { LyMenu } from '@alyle/ui/menu';
import { RoutesAppService } from './components/routes-app.service';
import { MinimalLS } from '@alyle/ui/ls';
import { Subscription } from 'rxjs';
import { LyIconService } from '@alyle/ui/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {
  routesComponents: any;
  angularVersion = VERSION;
  version = AUI_VERSION;
  routeState = false;
  mode = true;
  routerEvent: Subscription;
  @ViewChild(LyThemeContainer) themeContainer: LyThemeContainer;

  constructor(
    public router: Router,
    public routesApp: RoutesAppService,
    private iconService: LyIconService
  ) {
    iconService.setSvg('Heart', 'assets/svg/Heart');
    iconService.setSvg('Experiment', 'assets/svg/Experiment');
    iconService.setSvg('Radiation', 'assets/svg/radiation');
    this.routerEvent = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routeState = event.urlAfterRedirects !== '/';
        if (Platform.isBrowser) {
          if (environment.production) {
            ga('set', 'page', event.urlAfterRedirects);
            ga('send', 'pageview');
          }
        }
      }
    });
    this.routesComponents = this.routesApp.routesApp;
  }
  changeScheme() {
    this.mode = !this.mode;
    const name = this.mode ? 'minima-light' : 'minima-dark';
    // this.theme.setScheme(scheme);
    console.log(name);
    this.themeContainer.theme.setTheme(name);
  }
  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }
}
