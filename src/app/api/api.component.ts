import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AUI_VERSION } from '@alyle/ui';

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
  constructor(
    private http: HttpClient,
    public route: ActivatedRoute
  ) {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      this.pkgName = params.package;
      this.doc = this.http
      .get(isDevMode() ? `${location.origin}/api/${this.pkgName}/documentation.json` : `${host}/${this.pkgName}/documentation.json`, {responseType: 'json'});
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

  propertyTemplate(property: {
    name: string
    defaultValue: string
    type: string
  }) {
    return `${property.name}: ${property.type || 'any'}`;
  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
  }

}
