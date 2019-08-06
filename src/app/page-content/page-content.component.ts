import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { lyl, LyTheme2, LyHostClass } from '@alyle/ui';

import { AUIThemeVariables } from '@app/app.module';
import { AUIRoutesMap } from '../routes';

const absolute = lyl`{
  position: absolute
}`;

const item = lyl`{
  color: red
  ...${absolute}
}`;

const item2 = lyl`{
  ul {
    margin: 0
    padding: 0
    list-style: none
  }

  li {
    display: inline-block
    .test {
      color: red
    }
  }

  a {
    display: block
    padding: 6px 12px
    text-decoration: none
    span, div {
      color: red
    }
  }

  {
    ...${item}
  }

}`;

console.log(item, item2);

const STYLES = (theme: AUIThemeVariables) => {{{
  return {
    $global: lyl `{
      blockquote {
        color: red
      }
    }`,
    root: lyl `{
      blockquote {
        color: ${theme.text.secondary}
        border-${theme.before}: 3px solid ${theme.primary.default}
        padding: 0 1em
        margin: 0
      }
    }`
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
