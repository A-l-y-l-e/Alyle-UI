import { Component } from '@angular/core';

import { RoutesAppService } from '../routes-app.service';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html'
})
export class ComponentsComponent {
  routeName: string;
  constructor(
    public routesApp: RoutesAppService
  ) { }
}
