import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Platform } from '@alyle/ui';
import { environment } from '@env/environment';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent implements OnInit {
  private _route: string;
  title: string;
  urls: string[];
  status: string;
  defaultTitle = 'Alyle UI';
  @Input()
  set route(val: string) {
    this._route = val;
    const varArray = val.split('/').filter(_ => !!_);
    const latestItem = varArray[varArray.length - 1];
    this.urls = varArray.map(_ => _.charAt(0).toUpperCase() + _.slice(1));
    this.title = toTitle(latestItem === 'api' ? `${varArray[varArray.length - 2]} API` : latestItem);
    if (this.title) {
      this.titleService.setTitle(`${this.title} | ${this.defaultTitle}`);
    } else {
      this.titleService.setTitle(this.defaultTitle);
    }
    if (Platform.isBrowser) {
      if (environment.production) {
        ga('set', 'page', val);
        ga('send', 'pageview');
      }
    }
  }
  get route() {
    return this._route;
  }
  constructor(
    private titleService: Title,
  ) { }

  ngOnInit() {
  }

}

function toTitle(str: string) {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}
