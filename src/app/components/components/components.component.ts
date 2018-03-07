import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

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
    private titleService: Title,
    private meta: Meta
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routeName = event.urlAfterRedirects.replace(/\//g, '').replace('component', '');
        this.routesApp.componentState = this.routeName;
        if (this.routeName) {
          this.titleService.setTitle(`${this.routeName} - Alyle UI`);
        } else {
          this.titleService.setTitle(`Alyle UI`);
        }
      }
    });
  }

  ngOnInit() {
  }

}
