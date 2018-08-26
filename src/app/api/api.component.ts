import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'aui-api',
  templateUrl: './api.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiComponent implements OnInit {
  pkgName: string;
  doc: Observable<Object>;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.pkgName = this.router.url.split('/').reverse()[1];
    this.doc = this.http.get(`api/@alyle/ui/${this.pkgName}/documentation.json`, {responseType: 'json'});
  }

  ngOnInit() {
  }

  ref(moduleName: string) {
    return `import { ${moduleName} } from '@alyle/ui/${this.pkgName}'`;
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

}
