import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { lyl, LyTheme2, StyleRenderer } from '@alyle/ui';

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
  providers: [
    StyleRenderer
  ]
})
export class PageContentComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  pathPkg: string;
  isPkg: boolean;
  opts: {
    name: string
    items: string[]
  }[];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private _theme: LyTheme2,
    private _el: ElementRef<HTMLElement>,
    private _cd: ChangeDetectorRef,
    readonly sRenderer: StyleRenderer
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
