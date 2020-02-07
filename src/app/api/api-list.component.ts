import { Component, ChangeDetectionStrategy } from '@angular/core';
import { APIService, APIList } from './api.service';
import { Observable } from 'rxjs';
import {
  ThemeVariables,
  StyleRenderer } from '@alyle/ui';
import { AppComponent } from '@app/app.component';
import { tap } from 'rxjs/operators';

export const STYLES = (theme: ThemeVariables) => {
  const { before, after } = theme;
  return {
    root: (className: string) => `${className}{display:block;}`,
    apiList: (className: string) => `${className}{list-style:none;margin:0;padding:0;overflow:hidden;}${className} li{font-size:14px;margin:8px 0;line-height:14px;padding:0;float:${before};width:33%;overflow:hidden;min-width:220px;text-overflow:ellipsis;white-space:nowrap;}${className} li a{color:${theme.text.default} !important;display:inline-block;line-height:1.6rem;padding:0 16px;text-decoration:none;transition:all .3s;overflow:hidden;text-overflow:ellipsis;}`,
    Symbol: (className: string) => `${className}{display:inline-block;color:#ffffff;margin-${after}:8px;width:16px;height:16px;border-radius:3px;text-align:center;line-height:14px;font-size:10px;font-weight:600;padding:2px;box-sizing:border-box;}`,
    Class: (className: string) => `${className}{background:#2B2D42;}${className}::before{content:'Cl';}`,
    Const: (className: string) => `${className}{background:#8D99AE;}${className}::before{content:'K';}`,
    Decorator: (className: string) => `${className}{background:#EDF2F4;color:${theme.text.dark};}${className}::before{content:'@';}`,
    Directive: (className: string) => `${className}{background:#EF233C;}${className}::before{content:'D';}`,
    Component: (className: string) => `${className}{background:#D90429;}${className}::before{content:'C';}`,
    Enumeration: (className: string) => `${className}{background:#00CECB;}${className}::before{content:'E';}`,
    Function: (className: string) => `${className}{background:#9A48D0;}${className}::before{content:'F';}`,
    Interface: (className: string) => `${className}{background:#FFFFEA;color:${theme.text.dark};}${className}::before{content:'I';}`,
    NgModule: (className: string) => `${className}{background:#FFED66;color:${theme.text.dark};}${className}::before{content:'M';}`,
    ['Type alias']: (className: string) => `${className}{background:#D8D8D8;color:${theme.text.dark};}${className}::before{content:'T';}`,
    Injectable: (className: string) => `${className}{background:#FF5E5B;}${className}::before{content:'I';}`
  };
};

@Component({
  templateUrl: 'api-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class ApiListComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  apiListObservable: Observable<APIList[]>;
  filterTypeValue: string | null = null;
  readonly filterType = [
    'Class',
    'Const',
    'Decorator',
    'Directive',
    'Component',
    'Enumeration',
    'Function',
    'Interface',
    'NgModule',
    'Type alias',
    'Injectable'
  ];
  constructor(
    apiService: APIService,
    readonly sRenderer: StyleRenderer,
    app: AppComponent
  ) {
    this.apiListObservable = apiService.getList()
      .pipe(
        tap(() => app.docViewer && app.docViewer.setNoIndex(false)),
        tap(() => app.docViewer!.isLoading.emit(false))
      );
    sRenderer.addClass(this.classes.root);
  }

  hasItem(api: APIList) {
    return api.items.some(({ symbol }) => this.filterTypeValue == null || this.filterTypeValue === symbol);
  }

}
