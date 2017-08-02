import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LyTheme, LyPalette } from 'alyle-ui';
import { LyMenu } from 'alyle-ui/menu';
import { RoutesAppService } from './components/routes-app.service';
import { MinimalLS } from 'alyle-ui/ls'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  routesComponents: { route: string, name: string }[];
  @ViewChild('ThemeMenu') menuTheme: LyMenu;
  listColors: any[];
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public theme: LyTheme,
    public palette: LyPalette,
    public routesApp: RoutesAppService,
  ) {
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
