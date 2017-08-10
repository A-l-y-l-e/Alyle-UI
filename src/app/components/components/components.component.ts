import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { RoutesAppService } from '../routes-app.service';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent implements OnInit {

  constructor(
    public routesApp: RoutesAppService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  get componentState(): { route: string, name: string } {
    const routes = this.routesApp.routesApp;
    let route: { route: string, name: string };
    let routeName: string;
    if (this.router.url !== '/components') {
      routeName = this.route.children[0].routeConfig.path;
    }
    return routes.find((route) => route.route === routeName);
  }

  ngOnInit() {
  }

}
