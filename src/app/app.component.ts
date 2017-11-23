import { environment } from './../environments/environment';
import { Component, ViewChild, VERSION } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AUI_VERSION } from 'alyle-ui';
import { LyMenu } from 'alyle-ui/menu';
import { LyTheme } from 'alyle-ui/core';
import { RoutesAppService } from './components/routes-app.service';
import { MinimalLS } from 'alyle-ui/ls';
import { AlyleServiceConfig } from 'alyle-ui/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
    public routesApp: RoutesAppService,
    private swUpdate: SwUpdate,
  ) {
    this.router.events.subscribe(event => {
      if (environment.production) {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
          this.routeState = event.urlAfterRedirects !== '/';
          this.swUpdate.checkForUpdate();
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
