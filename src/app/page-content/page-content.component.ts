import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LyTheme2 } from '@alyle/ui';

import { AUIRoutesMap } from '../routes';

const commonConfigVariables = ['appearance', 'size', 'lyTyp'];

@Component({
  selector: 'aui-page-content',
  templateUrl: './page-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PageContentComponent {
  pathPkg: string;
  isPkg: boolean;
  opts: {
    name: string
    items: string[]
  }[];
  constructor(
    private _theme: LyTheme2,
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

    this.opts = [];
    if (isPkg) {
      this.pathPkg = routeUrlArray[2];
      const themePkg = this._theme.variables[this.pathPkg];
      commonConfigVariables.forEach((nam) => {
        const opt = {
          name: nam,
          items: [] as string[]
        };

        if (themePkg && themePkg[nam]) {
          opt.items.push(...Object.keys(themePkg[nam]));
        }

        if (opt.items.length) {
          this.opts.push(opt);
        }
      });
    }
    this.isPkg = !!isPkg;
    this._cd.markForCheck();
  }

}
