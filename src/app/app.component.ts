import { Component, ViewChild, VERSION, ChangeDetectionStrategy} from '@angular/core';
import { environment } from './../environments/environment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AUI_VERSION } from 'alyle-ui';
import { LyMenu } from 'alyle-ui/menu';
import { LyTheme, Platform } from 'alyle-ui/core';
import { RoutesAppService } from './components/routes-app.service';
import { MinimalLS } from 'alyle-ui/ls';
import { AlyleServiceConfig } from 'alyle-ui/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  routesComponents: any;
  @ViewChild('ThemeMenu') menuTheme: LyMenu;
  listColors: any[];
  angularVersion = VERSION;
  version: string = AUI_VERSION;
  routeState = false;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public theme: LyTheme,
    public routesApp: RoutesAppService
  ) {
    // this.route.url.subscribe((val) => {
    //   console.warn(val);
    // });
    this.router.events.subscribe(event => {
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
    this.listColors = [
      {
        primary: 'blue',
        accent: 'pink',
        colorScheme: 'light'
      },
      {
        primary: 'pink',
        accent: 'purple',
        colorScheme: 'light'
      },
      {
        primary: 'lightBlue',
        accent: 'purple',
        colorScheme: 'light'
      },
      {
        primary: 'cyan',
        accent: 'amber',
        colorScheme: 'light'
      }
    ];
  }
  changePrimary(color: AlyleServiceConfig) {
    this.theme.setTheme(color);
  }
}
