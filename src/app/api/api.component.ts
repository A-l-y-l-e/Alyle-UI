import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, isDevMode, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AUI_VERSION, LyTheme2, LY_THEME } from '@alyle/ui';

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
  themeJson: string;
  themePkg: {
    name: string
    themeJSON: any
  }[];
  constructor(
    private http: HttpClient,
    public route: ActivatedRoute,
    public theme: LyTheme2,
    @Inject(LY_THEME) private themeConfig
  ) {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      this.themeJson = null;
      this.themePkg = [];
      this.pkgName = params.package;
      this.doc = this.http
      .get(isDevMode() ? `${location.origin}/api/${this.pkgName}/documentation.json` : `${host}/${this.pkgName}/documentation.json`, {responseType: 'json'});
      themeConfig.forEach(pkg => {
        if (this.pkgName in pkg && Object.keys(pkg[this.pkgName]).length) {
          this.themePkg.push({
            name: pkg.name,
            themeJSON: JSON.stringify(pkg[this.pkgName], undefined, 2)
          });
        }
      });
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

}
