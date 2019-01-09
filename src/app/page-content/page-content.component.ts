import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AUIRoutesMap } from '../routes';

@Component({
  selector: 'aui-page-content',
  templateUrl: './page-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PageContentComponent {
  pathPkg: string;
  private _routeUrl: string;
  @Input()
  set routeUrl(val: string) {
    this._routeUrl = val;
  }
  get routeUrl() {
    return this._routeUrl;
  }
  constructor(
    public route: ActivatedRoute,
    public router: Router
  ) { }

  isPkg() {
    const routeUrlArray = this.routeUrl.split('/');
    const isPkg = AUIRoutesMap.has(this.routeUrl) && AUIRoutesMap.get(this.routeUrl).api;
    if (isPkg) {
      this.pathPkg = routeUrlArray[2];
    }
    return isPkg;
  }

}
