import {
  Component,
  Input,
  OnInit,
  Optional,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, of, merge, concat, throwError }      from 'rxjs';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { catchError, retry, mergeMap } from 'rxjs/operators';
import { Platform } from '@alyle/ui';

import { RoutesAppService } from '../../components/routes-app.service';

import sdk from '@stackblitz/sdk';

@Component({
  selector: 'demo-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit {
  hasCode = false;
  name: string;
  folderName: string;
  demos: {label: string, url: string, ext: string}[] = [];
  files = [
    {label: 'Html', type: 'component', ext: 'html'},
    {label: 'Component', type: 'component', ext: 'ts'},
    {label: 'Module', type: 'module', ext: 'ts'},
    {label: 'Style', type: 'component', ext: 'css'}
  ];
  da1;
  @Input() viewLabel: string;
  constructor(
    private http: HttpClient,
    private el: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  toggleCode() {
    this.hasCode = !this.hasCode;
  }
  getFile(index: number): Observable<string> {
    const url = this.url(index);
    const getUrl = this.http.get(url, { responseType: 'text' })
    .pipe(
      retry(10),
      catchError((err: HttpErrorResponse) => of(`Error: ${err.statusText}`))
    );
    if (Platform.isBrowser) {
      const req = merge(of('Loading...'), getUrl);
      return req;
    } else {
      return of();
    }
  }

  url(index: number) {
    const host = 'https://raw.githubusercontent.com/A-l-y-l-e/Alyle-UI/master/src/app/components/';
    const file = this.files[index];
    return `${host}${this.name}-demo/${this.folderName}/${this.folderName}.${file.type}.${file.ext}`;
  }

  openStackblitz() {
    const payload = {
      files: {
        'index.html': '',
        'main.ts': ''
      },
      title: '',
      description: '',
      template: 'angular-cli',
      dependencies: {
        '@alyle/ui': '*'
      }
    };
    sdk.openProject(payload, {
      newWindow: true
    });
  }

  ngOnInit() {
    this.name = this.router.url.replace(/\//g, '').replace(/component/, '');
    this.folderName = this.el.nativeElement.querySelector('.tab-container > *').nodeName.toLowerCase();
    this.files.forEach((item, i) => {
      this.files[i]['text'] = this.getFile(i);
    });
    for (let i = 0; i < this.files.length; i++) {
      const url = `${this.name}-demo/${this.folderName}/${this.folderName}.${this.files[i].type}.${this.files[i].ext}`;
      // this.getdata(url);
    }
  }

}
