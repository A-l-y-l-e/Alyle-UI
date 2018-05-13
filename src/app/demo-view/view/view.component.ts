import {
  Component,
  Input,
  OnInit,
  Optional,
  ElementRef
} from '@angular/core';
import { Observable, of }      from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { map } from 'rxjs/operators';

import { MinimalLS } from '@alyle/ui/ls';
import { Platform } from '@alyle/ui';

import { RoutesAppService } from '../../components/routes-app.service';

@Component({
  selector: 'demo-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  preserveWhitespaces: false
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
    private minimalLS: MinimalLS,
    private el: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  toggleCode() {
    this.hasCode = !this.hasCode;
  }
  getFile(index: number): Observable<string> {
    const url = this.url(index);
    const statusText = `Loading...`;
    const req = this.http.get(url, { responseType: 'text' });
    if (Platform.isBrowser) {
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
