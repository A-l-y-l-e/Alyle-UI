import {
  Component,
  Input,
  OnInit,
  Optional
} from '@angular/core';
import { Observable }      from 'rxjs/Rx';
import { Headers, RequestOptions, Http } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MinimalLS } from 'alyle-ui/ls';

import { RoutesAppService } from '../../components/routes-app.service';
import { DemoViewLabelDirective } from '../demo-view-label.directive';
import { DemoViewHtmlDirective } from '../demo-view-html.directive';
import { DemoViewTsDirective } from '../demo-view-ts.directive';
import { DemoViewCssDirective } from '../demo-view-css.directive';
import { DemoViewModuleDirective } from '../demo-view-module.directive';

export class demoUrls {
  html: string;
  ts: string;
  tsModule: string;
  css?: string;
}

@Component({
  selector: 'demo-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  hasCode = false;
  $demoUrls: demoUrls = new demoUrls();
  constructor(
    @Optional() public label: DemoViewLabelDirective,
    @Optional() public html: DemoViewHtmlDirective,
    @Optional() public ts: DemoViewTsDirective,
    @Optional() public css: DemoViewCssDirective,
    @Optional() public tsModule: DemoViewModuleDirective,
    private http: Http,
    private minimalLS: MinimalLS,
    private routesApp: RoutesAppService
  ) { }
  toggleCode() {
    this.hasCode = !this.hasCode;
  }
  private urlComponents() {
    return
  }
  private getdata(directive: any, ext: string, type: string = 'component'): Promise<any> {
    const statusText = `Loading...`;
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf8' });
    const options = new RequestOptions({ headers: headers });
    const gitUrl = `https://raw.githubusercontent.com/A-l-y-l-e/Alyle-UI/master/src/app`;
    const gitDir = `${this.gitComponentUrl(directive.src, type)}.${ext}`
    const url = `${gitUrl}/${gitDir}`;
    directive.statusText = statusText;
    const nameUrl = type === 'component' ? ext : 'tsModule';
    this.$demoUrls[nameUrl] = gitDir;
    if (this.minimalLS.hasItem(gitDir)) {
      directive.statusText = false;
    }
    return this.http.get(url, options)
                    .map((res: any) => {
                      const body: any = res._body;
                      this.minimalLS.setItem(gitDir, res._body);
                      directive.statusText = false;
                      return body || { };
                    })
                    .toPromise()
                    .catch((error: Response | any) => {
                      let errMsg: string;
                      if (error instanceof Response) {
                        const body: any = error.json() || '';
                        const err = body.error || JSON.stringify(body);
                        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
                      } else {
                        errMsg = error.message ? error.message : error.toString();
                      }
                      console.log(`%c${errMsg}`, 'color:red;');
                      if (!this.minimalLS.hasItem(gitDir)) {
                        directive.statusText = `${errMsg}`;
                      }
                      return Observable.throw(errMsg);
                    });
  }
  gitComponentUrl(name: string, type: string) {
    const route = this.routesApp.componentState;
    return `${route.route}-demo/${name}/${name}.${type}`
  }
  ngOnInit() {
    if (this.html) {
      this.getdata(this.html, 'html').then();
    }
    if (this.ts) {
      this.getdata(this.ts, 'ts').then();
    }
    if (this.css) {
      this.getdata(this.css, 'css').then().catch(() => {});
    }
    if (this.tsModule) {
      this.getdata(this.tsModule, 'ts', 'module').then().catch(() => {});
    }
  }

}
