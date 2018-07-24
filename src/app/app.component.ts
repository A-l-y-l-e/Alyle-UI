import { Component, ViewChild, VERSION, ChangeDetectionStrategy, OnDestroy, AfterViewInit} from '@angular/core';
import { environment } from './../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { AUI_VERSION, LyThemeContainer, Platform } from '@alyle/ui';
import { RoutesAppService } from './components/routes-app.service';
import { Subscription } from 'rxjs';
import { LyIconService } from '@alyle/ui/icon';
import { MinimaLight } from '@alyle/ui/themes/minima';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy, AfterViewInit {
  linkActive = '';
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
    iconService: LyIconService
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
    console.log(name);
    this.themeContainer.theme.setTheme(name);
  }

  ngAfterViewInit() {
    this.linkActive = this.themeContainer.theme.setUpStyle<MinimaLight>(
      'activatedRoute',
      theme => (
        `color: ${theme.primary.default};` +
        `border-right: 3px solid;`
      )
    );
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }
}
