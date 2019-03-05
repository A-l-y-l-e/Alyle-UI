import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Renderer2, isDevMode, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Platform } from '@alyle/ui';
import { environment } from '@env/environment';
import { AUIRoutesMap } from 'app/routes';
import { PageContentComponent } from '../../page-content/page-content.component';
import { Location } from '@angular/common';

let count = -1;

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TitleComponent implements OnInit {
  private _route: string;
  title: string;
  urls: string[];
  defaultTitle = 'Alyle UI';

  set route(val: string) {
    if (val !== this.route) {
      val = this._route = this._location.path();
      if (AUIRoutesMap.has(val) || val.indexOf('/api/') !== -1) {
        const varArray = val.split('/').filter(_ => !!_);
        const latestItem = varArray[varArray.length - 1];
        this.urls = varArray.map(_ => _.charAt(0).toUpperCase() + _.slice(1));
        this.title = toTitle(latestItem);
        if (this.title) {
          if (varArray.some(_ => _ === 'layout' || _ === 'components')) {
            const name = varArray[0] === 'components' ? varArray[0].slice(0, -1) : varArray[0];
            this.titleService.setTitle(`${this.title} Angular ${name} | ${this.defaultTitle}`);
          } else if (varArray.some(_ => _ === 'api')) {
            this.titleService.setTitle(`${this.title} API | ${this.defaultTitle}`);
          } else {
            this.titleService.setTitle(`${this.title} | ${this.defaultTitle}`);
          }
        } else {
          this.titleService.setTitle(this.defaultTitle);
        }
      } else {
        this.title = '';
        this.titleService.setTitle(this.defaultTitle);
      }

      if (Platform.isBrowser) {
        count++;
        if (count > 0 || val !== '') {
          Promise.resolve(null).then(() => {
            let ref = this.pageContent._getHostElement().querySelector('p');
            if (!ref) {
              ref = this.pageContent._getHostElement().querySelector('demo-view');
            }
            if (!ref) {
              ref = this.pageContent._getHostElement().querySelector('.ad');
            }
            if (ref) {
              const Div = this._renderer.createElement('div');
              const CodeFund = this._renderer.createElement('div');
              const CodeFundScript = this._renderer.createElement('script');
              const nextSibling = this._renderer.nextSibling(ref);
              const parentNode = this._renderer.parentNode(ref);
              this._renderer.appendChild(Div, CodeFund);
              CodeFundScript.src = 'https://codefund.app/properties/171/funder.js';
              CodeFundScript.async = 1;
              this._renderer.setStyle(CodeFund, 'display', 'inline-block');
              this._renderer.setStyle(CodeFund, 'background', '#fff');
              this._renderer.setAttribute(CodeFund, 'id', 'codefund');
              this._renderer.insertBefore(
                parentNode,
                Div,
                nextSibling
              );
              if (isDevMode()) {
                CodeFund.innerHTML = '--ad--';
              } else {
                this._renderer.appendChild(
                  Div,
                  CodeFundScript
                );
              }
            }
          });
        }
      }
      this._cd.markForCheck();
    }
    if (Platform.isBrowser && environment.production) {
      ga('set', 'page', this._location.path(true) || '/');
      ga('send', 'pageview');
    }
  }
  get route() {
    return this._route;
  }
  constructor(
    private titleService: Title,
    private _renderer: Renderer2,
    private pageContent: PageContentComponent,
    private _location: Location,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

}

function toTitle(str: string) {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/\-/g, ' ');
}
