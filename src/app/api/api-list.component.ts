import { Component, ChangeDetectionStrategy } from '@angular/core';
import { APIService, APIList } from './api.service';
import { Observable } from 'rxjs';
import { lyl, ThemeVariables, StyleRenderer } from '@alyle/ui';
import { AppComponent } from '@app/app.component';
import { tap } from 'rxjs/operators';

export const STYLES = (theme: ThemeVariables) => {
  const { before, after } = theme;
  return {
    root: lyl `{
      display: block
    }`,
    apiList: lyl `{
      list-style: none
      margin: 0
      padding: 0
      overflow: hidden
      li {
        font-size: 14px
        margin: 8px 0
        line-height: 14px
        padding: 0
        float: ${before}
        width: 33%
        overflow: hidden
        min-width: 220px
        text-overflow: ellipsis
        white-space: nowrap
        a {
          color: ${theme.text.default} !important
          display: inline-block
          line-height: 1.6rem
          padding: 0 16px
          text-decoration: none
          transition: all .3s
          overflow: hidden
          text-overflow: ellipsis
        }
      }
    }`,
    Symbol: lyl `{
      display: inline-block
      color: #ffffff
      margin-${after}: 8px
      width: 16px
      height: 16px
      border-radius: 3px
      text-align: center
      line-height: 14px
      font-size: 10px
      font-weight: 600
      padding: 2px
      box-sizing: border-box
    }`,
    Class: lyl `{
      background: #2B2D42
      &::before {
        content: 'Cl'
      }
    }`,
    Const: lyl `{
      background: #8D99AE
      &::before {
        content: 'K'
      }
    }`,
    Decorator: lyl `{
      background: #EDF2F4
      color: ${theme.text.dark}
      &::before {
        content: '@'
      }
    }`,
    Directive: lyl `{
      background: #EF233C
      &::before {
        content: 'D'
      }
    }`,
    Component: lyl `{
      background: #D90429
      &::before {
        content: 'C'
      }
    }`,
    Enumeration: lyl `{
      background: #00CECB
      &::before {
        content: 'E'
      }
    }`,
    Function: lyl `{
      background: #9A48D0
      &::before {
        content: 'F'
      }
    }`,
    Interface: lyl `{
      background: #FFFFEA
      color: ${theme.text.dark}
      &::before {
        content: 'I'
      }
    }`,
    NgModule: lyl `{
      background: #FFED66
      color: ${theme.text.dark}
      &::before {
        content: 'M'
      }
    }`,
    ['Type alias']: lyl `{
      background: #D8D8D8
      color: ${theme.text.dark}
      &::before {
        content: 'T'
      }
    }`,
    Injectable: lyl `{
      background: #FF5E5B
      &::before {
        content: 'I'
      }
    }`
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
