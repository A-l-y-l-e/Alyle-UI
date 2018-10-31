import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'aui-page-content',
  templateUrl: './page-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PageContentComponent implements OnInit {
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

  ngOnInit() {
  }

  isPkg() {
    const routeUrlArray = this.routeUrl.split('/');
    if (routeUrlArray.some(_ => _ === 'shadow')) {
      return false;
    }
    const isPkg = routeUrlArray.some(_ => (_ === 'components' || _ === 'layout'));
    if (isPkg) {
      this.pathPkg = routeUrlArray[2];
    }
    return isPkg;
  }

}
