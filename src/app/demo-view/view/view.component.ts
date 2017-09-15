import {
  Component,
  Input,
  OnInit,
  Optional,
  ElementRef
} from '@angular/core';
import { Observable }      from 'rxjs/Rx';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MinimalLS } from 'alyle-ui/ls';

import { RoutesAppService } from '../../components/routes-app.service';
import { DemoViewLabelDirective } from '../demo-view-label.directive';
import { DemoViewHtmlDirective } from '../demo-view-html.directive';
import { DemoViewTsDirective } from '../demo-view-ts.directive';
import { DemoViewCssDirective } from '../demo-view-css.directive';
import { DemoViewSrcsDirective } from '../demo-view-srcs.directive';
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
  name: string;
  folderName: string;
  demos: {label: string, url: string, ext: string}[] = [];
  constructor(
    @Optional() public label: DemoViewLabelDirective,
    @Optional() public html: DemoViewHtmlDirective,
    @Optional() public ts: DemoViewTsDirective,
    @Optional() public css: DemoViewCssDirective,
    @Optional() public tsModule: DemoViewModuleDirective,
    @Optional() public srcs: DemoViewSrcsDirective,
    private http: Http,
    private minimalLS: MinimalLS,
    private el: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  toggleCode() {
    this.hasCode = !this.hasCode;
  }
  private urlComponents() {
    return
  }
  private getdata(dir: string): Promise<any> {
    const statusText = `Loading...`;
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf8' });
    const options = new RequestOptions({ headers: headers });
    const gitUrl = `https://raw.githubusercontent.com/A-l-y-l-e/Alyle-UI/master/src/app/components`;
    const url = `${gitUrl}/${dir}`;
    return this.http.get(url, options)
                    .map((res: any) => {
                      const body: any = res._body;
                      this.minimalLS.setItem(dir, res._body);
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
                      return Observable.throw(errMsg);
                    });
  }

  ngOnInit() {
    this.name = this.router.url.replace(/\//g, '').replace(/components/, '');
    this.folderName = this.el.nativeElement.querySelector('.tab-container > *').nodeName.toLowerCase();
    const exts = [
      {label: 'Html', type: 'component', ext: 'html'},
      {label: 'Component', type: 'component', ext: 'ts'},
      {label: 'Module', type: 'module', ext: 'ts'},
      {label: 'Style', type: 'component', ext: 'css'}
    ]
    for (let i = 0; i < exts.length; i++) {
      let url = `${this.name}-demo/${this.folderName}/${this.folderName}.${exts[i].type}.${exts[i].ext}`;
      this.demos.push({
        url: url,
        label: exts[i].label,
        ext: exts[i].ext
      });
      this.getdata(url).then();
    }
  }

}
