import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  isPkg: boolean;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private _el: ElementRef<HTMLElement>,
    private _cd: ChangeDetectorRef
  ) { }

  _getHostElement() {
    return this._el.nativeElement;
  }

  updateRoute(path: string) {
    const routeUrlArray = path.split('/');
    const isPkg = AUIRoutesMap.has(path) && AUIRoutesMap.get(path)!.api;
    if (isPkg) {
      this.pathPkg = routeUrlArray[2];
    }
    this.isPkg = !!isPkg;
    this._cd.markForCheck();
  }

}
