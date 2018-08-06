import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { RoutesAppService } from '../../components/routes-app.service';
import { Title } from '@angular/platform-browser';
import { Platform } from '@alyle/ui';
import { environment } from '@env/environment';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent implements OnInit {
  private _route: string;
  title: string;
  urls: string[];
  status: string;
  get routeData() {
    const random = Math.random();
    return {
      random
    };
  }
  defaultTitle = 'Alyle UI';
  @Input()
  set route(val: string) {
    this._route = val;
    const varArray = val.split('/').filter(_ => !!_);
    const ArrayString = varArray.reverse()[0];
    this.urls = varArray.map(_ => _.charAt(0).toUpperCase() + _.slice(1));
    this.title = findByProp(this.routesAppService.routesApp, 'route', ArrayString, 'name');
    const status = findByProp(this.routesAppService.routesApp, 'route', ArrayString, 'status');
    this.status = status;
    console.log(status, this.title);
    if (this.title) {
      this.titleService.setTitle(`${this.title} | ${this.defaultTitle}`);
    } else {
      this.titleService.setTitle(this.defaultTitle);
    }
    if (Platform.isBrowser) {
      if (environment.production) {
        ga('set', 'page', val);
        ga('send', 'pageview');
      }
    }
  }
  get route() {
    return this._route;
  }
  constructor(
    private routesAppService: RoutesAppService,
    private titleService: Title,
  ) { }

  ngOnInit() {
  }

}

function findByProp(o, prop, val, retprop?) {
  if (o == null) { return false; }
  if (o[prop] === val) {
    return (retprop) ? o[retprop] : o;
  }
  let result, p;
  for (p in o) {
    if (o.hasOwnProperty(p) && typeof o[p] === 'object') {
      result = findByProp(o[p], prop, val);
      if (result) {
        return (retprop) ? result[retprop] : result;
      }
    }
  }
  return (retprop) ? result[retprop] : result;
}
