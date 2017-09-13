import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LyTheme, LyPalette, AUI_VERSION } from 'alyle-ui';
import { LyMenu } from 'alyle-ui/menu';
import { RoutesAppService } from './components/routes-app.service';
import { MinimalLS } from 'alyle-ui/ls'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  routesComponents: any;
  @ViewChild('ThemeMenu') menuTheme: LyMenu;
  listColors: any[];
  version: string = AUI_VERSION;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public theme: LyTheme,
    public palette: LyPalette,
    public routesApp: RoutesAppService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
    this.routesComponents = this.routesApp.routesApp;
    this.listColors = [
      {
        name: 'deepOrange',
      },
      {
        name: 'pink',
      },
      {
        name: 'blue',
      },
      {
        name: 'amber',
      }
    ];
  }
  changePrimary(color: string) {
      this.palette.setPrimary(color);
      this.menuTheme.toggleMenu();
    }
}
