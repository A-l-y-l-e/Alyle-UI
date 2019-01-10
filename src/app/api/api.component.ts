import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, isDevMode, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AUI_VERSION, LyTheme2, LY_THEME } from '@alyle/ui';
import { AUIRoutesMap } from '../routes';

const host = `https://raw.githubusercontent.com/A-l-y-l-e/alyle-ui-api/${AUI_VERSION}`;

@Component({
  selector: 'aui-api',
  templateUrl: './api.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiComponent implements OnInit, OnDestroy {
  pkgName: string;
  doc: Observable<Object>;
  routeParamsSubscription = Subscription.EMPTY;
  themeJson: string | null;
  themePkg: {
    name: string
    themeJSON: any
  }[];
  constructor(
    private http: HttpClient,
    public route: ActivatedRoute,
    private router: Router,
    public theme: LyTheme2,
    @Inject(LY_THEME) themeConfig
  ) {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      if (AUIRoutesMap.has(this.router.url)) {
        this.themeJson = null;
        this.themePkg = [];
        this.pkgName = params.package;
        this.doc = this.http
        .get(isDevMode() ? `${location.origin}/api/${this.pkgName}.json` : `${host}/${this.pkgName}.min.json`, {responseType: 'json'});
        themeConfig.forEach(themeInfo => {
          if (this.pkgName in themeInfo && Object.keys(themeInfo[this.pkgName]).length) {
            this.themePkg.push({
              name: themeInfo.name,
              themeJSON: JSON.stringify(themeInfo[this.pkgName], undefined, 2)
            });
          }
        });
        if (this.themePkg.length && this.themePkg[0].themeJSON === this.themePkg[1].themeJSON) {
          this.themePkg.pop();
        }
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  ngOnInit() {
  }

  ref(moduleName: string) {
    return `import { ${moduleName} } from '@alyle/ui/${this.pkgName}';`;
  }

  inputTemplate(input: {name: string, type: string}) {
    return `@Input()\n${input.name}: ${input.type || 'any'}`;
  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
  }

  joinList(_) {
    return _.map(__ => __.children).join(`\n`);
  }

}
