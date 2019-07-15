import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  VERSION,
  isDevMode,
  Renderer2
} from '@angular/core';
import { Observable, of, merge, forkJoin } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, retry, map } from 'rxjs/operators';
import { Platform, AUI_VERSION, LyTheme2 } from '@alyle/ui';
import { AUIThemeVariables } from '../../app.module';
import { DomSanitizer } from '@angular/platform-browser';

const MODULE_REGEXP = /export\sclass\s([\w]+)Module/;
const EXPORTS_REGEXP = /exports\:\s?\[[\w]+\]\,?([\s]+)?/;
const IMPORTS_POINT_REGEXP = /imports\:?(?:[\s]+)?\[(?:[\s]+)?/;
const DECLARATIONS_REGEXP = /declarations: \[\:?(?:[\s]+)?([\w]+)(?:[\,\s\w]+)?\]/;
const SELECTOR_REGEXP = /selector: \'([\w-]+)\'/;
const SELECTOR_APP = 'root-app';

const HOST_DEV = 'http://localhost:1212/demos';
const HOST_PROD = `https://raw.githubusercontent.com/A-l-y-l-e/alyle-ui-docs-content/${AUI_VERSION}/demos`;
const styles = (theme: AUIThemeVariables) => ({
  root: {
    position: 'relative',
    display: 'block',
    '> div > ly-paper': {
      display: 'block'
    }
  },
  codeContainer: {
    overflowY: 'auto',
    height: '100%',
    background: 'transparent',
    marginTop: '1px',
    '> *': {
      margin: 0
    }
  },
  tabContainer: {
    padding: '48px 24px 24px 24px'
  },
  tabContent: {
    padding: '24px 24px 0 24px'
  },
  code: {
    position: 'absolute',
    after: 0,
    top: '4px',
    zIndex: 1
  },
  stackblitzButton: {
    '&:hover': {
      color: theme.stackblitz
    }
  }
});

interface Demos {
  path?: string;
  label: string;
  type?: string;
  ext?: string;
}

@Component({
  selector: 'demo-view',
  templateUrl: './view.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(styles);
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
  set extraPaths(val: string[]) {
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
    renderer: Renderer2,
    private http: HttpClient,
    private el: ElementRef,
    private router: Router,
    private sanitizer: DomSanitizer,
    private theme: LyTheme2
  ) {
    renderer.addClass(el.nativeElement, this.classes.root);
  }
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
    if (Platform.isBrowser) {
      const req = merge(of('Loading...'), getUrl);
      return req;
    } else {
      return of();
    }
  }

  url(index: number) {
    const file = this.files[index];
    const host = `${isDevMode() ? HOST_DEV : HOST_PROD}`;
    if (file.path) {
      return `${host}/${file.path}.html`;
    }
    const fileName = this.path.split('/').reverse()[0];
    return `${host}/${fileName}.${file.type}.${file.ext}.html`;
  }

  openPostStackblitz() {
    const win = window.open('about:blank', '_blank')!;
    win.document.write('Loading...');
    const urls = this.files
    .map((_item, index) => this.url(index))
    .map(_ => this.http.get(_, { responseType: 'text' })
      // Convert html to string, since from the server it comes in html.
      .pipe(map(html => {
        const span = window.document.createElement('span');
        span.innerHTML = html;
        return span.innerText;
      })));
    const data = forkJoin(
      ...urls
    );
    data.subscribe(([res1, res2, res3, ...others]) => {
      const otherModules = `/** Angular */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/** Alyle UI */
import { LyThemeModule, LY_THEME, LY_THEME_GLOBAL_VARIABLES } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

export class GlobalVariables {
  testVal = '#00bcd4';
  Quepal = {
    default: \`linear-gradient(135deg,#11998e 0%,#38ef7d 100%)\`,
    contrast: '#fff',
    shadow: '#11998e'
  };
  SublimeLight = {
    default: \`linear-gradient(135deg,#FC5C7D 0%,#6A82FB 100%)\`,
    contrast: '#fff',
    shadow: '#B36FBC'
  };
  Amber = {
    default: '#ffc107',
    contrast: 'rgba(0, 0, 0, 0.87)'
  };
}
`;
      let moduleName: string;
      const AppModule = otherModules + res3.replace(MODULE_REGEXP, (str, token) => {
        const name = token + 'App';
        moduleName = name + 'Module';
        return str
        .replace(token, name);
      }).replace(EXPORTS_REGEXP, '')
      .replace(IMPORTS_POINT_REGEXP, (str) => {
        return str + `BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LyThemeModule.setTheme('minima-light'),
    `;
      }).replace(DECLARATIONS_REGEXP, (str, token) => {
        return `bootstrap: [${token}],
  providers: [
    {
      provide: LY_THEME,
      useClass: MinimaLight,
      multi: true
    },
    {
      provide: LY_THEME,
      useClass: MinimaDark,
      multi: true
    },
    {
      provide: LY_THEME_GLOBAL_VARIABLES,
      useClass: GlobalVariables
    } // global variables
  ],\n  ` + str;
      });

      const appComponentTs = res2.replace(SELECTOR_REGEXP, (str, token) => str.replace(token, SELECTOR_APP));
      const form = this.makeForm([res1, appComponentTs, AppModule, ...others], moduleName!);
      win.document.body.appendChild(form);
      form.submit();
      win.document.close();
    });
  }

  makeForm([res1, res2, res3, ...others], moduleName: string) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.setAttribute('style', 'display:none;');
    // form.target = '_blank';
    const name = this.path.split('/').reverse()[0];
    const htmlName = encodeURIComponent(`app/${name}.component.html`);
    form.action = `https://run.stackblitz.com/api/angular/v1/?file=${htmlName}`;
    const title = name.replace(/-/g, ' ') + ' | Alyle UI';
    const payload: {
      files: {[path: string]: string};
      title: string;
      description: string;
      template: 'angular-cli' | 'create-react-app' | 'typescript' | 'javascript';
      tags?: string[];
      dependencies?: {[name: string]: string};
      settings?: {
        compile?: {
          trigger?: 'auto' | 'keystroke' | 'save';
          action?: 'hmr' | 'refresh';
          clearConsole?: boolean;
        };
      };
    } = {
      files: {
        [`app/${name}.component.html`]: res1,
        [`app/${name}.component.ts`]: res2,
        [`app/${name}.module.ts`]: res3,
        'main.ts': (
          `import './polyfills';\n` +
          `import { BrowserModule } from '@angular/platform-browser';\n` +
          `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\n` +
          `import { ${moduleName} } from './app/${name}.module';\n` +
          `\n` +
          `platformBrowserDynamic().bootstrapModule(${moduleName}).then(ref => {\n` +
          `  // Ensure Angular destroys itself on hot reloads.\n` +
          `  if (window['ngRef']) {\n` +
          `    window['ngRef'].destroy();\n` +
          `  }\n` +
          `  window['ngRef'] = ref;\n` +
          `\n` +
          `  // Otherwise, log the boot error\n` +
          `}).catch(err => console.error(err));`
        ),
        'polyfills.ts': (
          `import 'core-js/es6/reflect';\nimport 'core-js/es7/reflect';\nimport 'zone.js/dist/zone';\nimport 'hammerjs';\nimport 'web-animations-js';\n`
        ),
        'index.html': (
          `<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons" rel="stylesheet">\n` +
          `<${SELECTOR_APP}></${SELECTOR_APP}>`
        )
      },
      title,
      description: title,
      template: 'angular-cli',
      dependencies: {
        '@alyle/ui': AUI_VERSION,
        '@angular/cli': '^8.0.3',
        '@angular/core': VERSION.full,
        '@angular/common': VERSION.full,
        '@angular/forms': VERSION.full,
        '@angular/animations': VERSION.full,
        '@angular/platform-browser': VERSION.full,
        '@angular/compiler': VERSION.full,
        '@angular/platform-browser-dynamic': VERSION.full,
        'chroma-js': '^2.0.2',
        'core-js': '^2.6.1',
        'zone.js': '^0.9.1',
        'rxjs': '^6.4.0',
        'hammerjs': '2.0.8'
      },
      settings: {
        compile: {
          action: 'refresh',
          clearConsole: false
        }
      }
    };

    others.forEach((text, index) => {
      const filePath = `app/${this.files[index + 3].path!}`;
      payload.files[filePath] = text;
    });

    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        let input;
        const element = payload[key];
        if (typeof element === 'string') {
          input = this.createHiddenField(`[${key}]`, element);
          form.appendChild(input);
        } else if (key === 'files') {
          Object.keys(element).forEach(_ => {
            input = this.createHiddenField(`[${key}][${_}]`, element[_]);
            form.appendChild(input);
          });
        } else {
          input = this.createHiddenField(`[${key}]`, JSON.stringify(element));
          form.appendChild(input);
        }
      }
    }

    return form;
  }

  createHiddenField(name: string, value: string) {
    const field = document.createElement('input');
    field.setAttribute('type', 'hidden');
    field.setAttribute('value', value);
    field.setAttribute('name', name);
    return field;
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
