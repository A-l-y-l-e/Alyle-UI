import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  isDevMode,
} from '@angular/core';
import { Observable, of, merge, forkJoin } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, retry, map } from 'rxjs/operators';
import { lyl, StyleRenderer, ThemeRef } from '@alyle/ui';
import { AUIThemeVariables } from '../../app.module';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Platform } from '@angular/cdk/platform';
import stackblitz from '@stackblitz/sdk';

const PROJECT_TEMPLATE: 'node' = 'node';

const MODULE_REGEXP = /export\sclass\s([\w]+Module)/;
const SELECTOR_REGEXP = /selector: \'([\w-]+)\'/;

export const STYLES = (theme: AUIThemeVariables, ref: ThemeRef) => {
  const classes = ref.selectorsOf(STYLES);
  const $host = 'fonts/firacode/';
  const { after } = theme;
  return {
    $global: lyl `{
      @font-face {
        font-family: Fira Code
        src: url('${$host}eot/FiraCode-Light.eot')
        src: url('${$host}eot/FiraCode-Light.eot') format('embedded-opentype'),
            url('${$host}woff2/FiraCode-Light.woff2') format('woff2'),
            url('${$host}woff/FiraCode-Light.woff') format('woff'),
            url('${$host}ttf/FiraCode-Light.ttf') format('truetype')
        font-weight: 300
        font-style: normal
      }
      @font-face {
          font-family: Fira Code
          src: url('${$host}eot/FiraCode-Regular.eot')
          src: url('${$host}eot/FiraCode-Regular.eot') format('embedded-opentype'),
              url('${$host}woff2/FiraCode-Regular.woff2') format('woff2'),
              url('${$host}woff/FiraCode-Regular.woff') format('woff'),
              url('${$host}ttf/FiraCode-Regular.ttf') format('truetype')
          font-weight: 400
          font-style: normal
      }

      @font-face {
          font-family: Fira Code
          src: url('${$host}eot/FiraCode-Medium.eot')
          src: url('${$host}eot/FiraCode-Medium.eot') format('embedded-opentype'),
              url('${$host}woff2/FiraCode-Medium.woff2') format('woff2'),
              url('${$host}woff/FiraCode-Medium.woff') format('woff'),
              url('${$host}ttf/FiraCode-Medium.ttf') format('truetype')
          font-weight: 500
          font-style: normal
      }

      @font-face {
          font-family: Fira Code
          src: url('${$host}eot/FiraCode-Bold.eot')
          src: url('${$host}eot/FiraCode-Bold.eot') format('embedded-opentype'),
              url('${$host}woff2/FiraCode-Bold.woff2') format('woff2'),
              url('${$host}woff/FiraCode-Bold.woff') format('woff'),
              url('${$host}ttf/FiraCode-Bold.ttf') format('truetype')
          font-weight: 700
          font-style: normal
      }
    }`,
    root: () => lyl `{
      position: relative
      display: block
      > div > ly-paper {
        display: block
      }
      ...${theme.demoViewer?.(classes)}
    }`,
    codeContainer: lyl `{
      overflow-y: auto
      height: 100%
      background: transparent
      margin-top: 1px
      > * {
        margin: 0
      }
    }`,
    tabContainer: lyl `{
      padding: 48px 24px 24px 24px
    }`,
    tabContent: lyl `{
      padding: 24px 24px 0 24px
    }`,
    code: lyl `{
      position: absolute
      ${after}: 0
      top: 4px
      z-index: 1
    }`,
    stackblitzButton: lyl `{
      &:hover {
        color: ${theme.stackblitz}
      }
    }`
  };
};

interface Demos {
  path?: string;
  label: string;
  type?: string;
  ext?: string;
  text?: Observable<SafeHtml>;
}

@Component({
  selector: 'demo-view',
  templateUrl: './view.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ],
  standalone: false
})
export class ViewComponent implements OnInit {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  hasCode = false;
  name: string;
  folderName: string;
  demos: {label: string, url: string, ext: string}[] = [];
  files: Demos[] = [
    {label: 'Template', type: 'component', ext: 'html'},
    {label: 'Component', type: 'component', ext: 'ts'},
    {label: 'Module', type: 'module', ext: 'ts'}
  ];
  @Input() viewLabel: string;
  @Input() path: string;
  @Input()
  set extraPaths(val: string[] | string) {
    if (typeof val === 'string') {
      val = val.split(',');
    }
    val.forEach(item => {
      this.files.push({
        label: item,
        path: item,
        ext: getLanguage(item)
      });
    });
    this.files.push();
  }
  constructor(
    readonly sRenderer: StyleRenderer,
    private http: HttpClient,
    private el: ElementRef,
    private router: Router,
    private sanitizer: DomSanitizer,
    private _platform: Platform
  ) { }
  toggleCode() {
    this.hasCode = !this.hasCode;
  }
  getFile(index: number): Observable<string> {
    const url = this.url(index);
    const getUrl = this.http.get(url, { responseType: 'text' })
    .pipe(
      retry(3),
      catchError((err: HttpErrorResponse) => of(`Error: ${err.statusText}`))
    );
    if (this._platform.isBrowser) {
      const req = merge(of('Loading...'), getUrl);
      return req;
    } else {
      return of();
    }
  }

  url(index: number) {
    const file = this.files[index];
    if (file.path) {
      return `./api/docs/demos/${file.path}.html`;
    }
    const fileName = this.path.split('/').reverse()[0];
    return `./api/docs/demos/${fileName}.${file.type}.${file.ext}.html`;
  }

  openPostStackblitz() {
    const urls = this.files
    .map((_item, index) => this.url(index))
    .map(_ => this.http.get(_, { responseType: 'text' })
      // Convert html to string, since from the server it comes in html.
      .pipe(map(html => {
        const span = window.document.createElement('span');
        span.innerHTML = html;
        return span.innerText;
      })));
    const data = forkJoin([
      this.http.get('assets/stackblitz-files.json', { responseType: 'json' }),
      ...urls,
    ]);
    data.subscribe(([files, res1, res2, res3, ...others]: [any, string, string, string, ...string[]]) => {
      this.createStackBlitz([files, res1, res2, res3, ...others]);
    });
  }

  createStackBlitz([initialApp, res1, res2, res3, ...others]) {
    const name = this.path.split('/').reverse()[0];
    const htmlName = encodeURIComponent(`src/app/example/${name}.component.html`);
    const title = name.replace(/-/g, ' ') + ' | Alyle UI';
    const selector = SELECTOR_REGEXP.exec(res2)![1];
    const moduleName = MODULE_REGEXP.exec(res3)![1];
    const payload = {
      files: {
        ...initialApp,
        [`src/app/example/${name}.component.html`]: res1,
        [`src/app/example/${name}.component.ts`]: res2,
        [`src/app/example/${name}.module.ts`]: res3
      },
      title,
      description: title,
      template: PROJECT_TEMPLATE,
      settings: {
        compile: {
          action: 'refresh',
          clearConsole: false
        }
      }
    };

    payload.files[`src/app/app.component.html`] = initialApp[`src/app/app.component.html`]
      .replace('template', `<${selector}></${selector}>`);
    payload.files[`src/app/app.module.ts`] = initialApp[`src/app/app.module.ts`]
      .replace(/\/\/ importExampleModule/, `import { ${moduleName} } from './example/${name}.module';`)
      .replace(/\/\/ ExampleModule/, moduleName);

    others.forEach((text, index) => {
      const filePath = `src/app/example/${this.files[index + 3].path!}`;
      payload.files[filePath] = text;
    });
    stackblitz.openProject(payload, {openFile: htmlName });
  }

  encode(str: string) {
    const buf: string[] = [];

    for (let i = str.length - 1; i >= 0; i--) {
      buf.unshift(['&#', str[i].charCodeAt(0), ';'].join(''));
    }

    return buf.join('');
  }

  ngOnInit() {
    this.name = this.router.url.replace(/\//g, '').replace(/component/, '');
    if (isDevMode() && !this.path) {
      this.folderName = this.el.nativeElement.querySelector('.tab-container > *').nodeName.toLowerCase();
      console.warn('required path for', this.router.url, this.folderName);
    }
    this.files.forEach((_item, i) => {
      this.files[i]['text'] = this.getFile(i).pipe(map(html => this.sanitizer.bypassSecurityTrustHtml(html)));
    });
  }

}

function getLanguage(str: string) {
  return str.split(/\./).reverse()[0];
}
