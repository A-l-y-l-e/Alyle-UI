import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { RoutesAppService } from '../routes-app.service';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent implements OnInit {
  routeName: string;
  constructor(
    public routesApp: RoutesAppService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routeName = event.urlAfterRedirects.replace(/\//g, '').replace('components', '');
        this.routesApp.componentState = this.routeName;
      }
    });
  }

  ngOnInit() {
  }

}
