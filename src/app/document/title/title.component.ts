import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { RoutesAppService } from '../../components/routes-app.service';

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
  get routeData() {
    const random = Math.random();
    return {
      random
    };
  }
  @Input()
  set route(val: string) {
    this._route = val;
    const varArray = val.split('/').filter(_ => !!_);
    this.urls = varArray.map(_ => _.charAt(0).toUpperCase() + _.slice(1));
    this.title = findByProp(this.routesAppService.routesApp, 'route', varArray.reverse()[0], 'name');
  }
  get route() {
    return this._route;
  }
  constructor(
    private routesAppService: RoutesAppService
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
