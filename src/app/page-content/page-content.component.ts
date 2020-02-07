import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  st2c,
  LyTheme2,
  LyHostClass } from '@alyle/ui';

import { AUIThemeVariables } from '@app/app.module';
import { AUIRoutesMap } from '../routes';

const absolute = (className: string) => `${className}{position:absolute;}`;

const item = (className: string) => `${className}{color:red;}${st2c((absolute), `${className}`)}`;

const item2 = (className: string) => `${st2c((item), `${className}`)}${className} ul{margin:0;padding:0;list-style:none;}${className} li{display:inline-block;}${className} li .test{color:red;}${className} a{display:block;padding:6px 12px;text-decoration:none;}${className} a span,${className} a div{color:red;}`;

console.log(item, item2);

const STYLES = (theme: AUIThemeVariables) => {{{
  return {
    $global: (className: string) => `${className} blockquote{color:red;}`,
    root: (className: string) => `${className} blockquote{color:${theme.text.secondary};border-${theme.before}:3px solid ${theme.primary.default};padding:0 1em;margin:0;}`
  };
}}};

const commonConfigVariables = ['appearance', 'size', 'lyTyp'];

@Component({
  selector: 'aui-page-content',
  templateUrl: './page-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [LyHostClass]
})
export class PageContentComponent {
  readonly classes = this._theme.addStyleSheet(STYLES);
  pathPkg: string;
  isPkg: boolean;
  opts: {
    name: string
    items: string[]
  }[];
  constructor(
    _hostClass: LyHostClass,
    public route: ActivatedRoute,
    public router: Router,
    private _theme: LyTheme2,
    private _el: ElementRef<HTMLElement>,
    private _cd: ChangeDetectorRef
  ) {
    _hostClass.add(this.classes.root);
  }

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
