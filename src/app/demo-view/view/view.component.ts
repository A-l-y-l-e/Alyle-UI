import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  VERSION,
  isDevMode
} from '@angular/core';
import { Observable, of, merge, forkJoin } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';
import { Platform, AUI_VERSION, LyTheme2 } from '@alyle/ui';

const MODULE_REGEXP = /export\sclass\s([\w]+)/;
const EXPORTS_REGEXP = /exports\:\s?\[[\w]+\]\,?([\s]+)?/;
const IMPORTS_POINT_REGEXP = /imports\:?(?:[\s]+)?\[(?:[\s]+)?/;
const DECLARATIONS_REGEXP = /declarations: \[\:?(?:[\s]+)?([\w]+)(?:[\s]+)?\]/;
const SELECTOR_REGEXP = /selector: \'([\w-]+)\'/;
const SELECTOR_APP = 'my-app';

const styles = {
  codeContainer: {
    maxHeight: '200px',
    overflowY: 'auto'
  }
};

const toCamelCase = (str) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\s+/g, '');

function toPascalCase(str: string) {
  return str.match(/[a-z]+/gi)
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    .join('');
}

@Component({
  selector: 'demo-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit {
  classes: {
    codeContainer: string
  };
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
  @Input() viewLabel: string;
  @Input() path: string;
  constructor(
    private http: HttpClient,
    private el: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private theme: LyTheme2
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
    if (Platform.isBrowser) {
      const req = merge(of('Loading...'), getUrl);
      return req;
    } else {
      return of();
    }
  }

  url(index: number) {
    const fileName = this.path.split('/').reverse()[0];
    const host = `https://raw.githubusercontent.com/A-l-y-l-e/Alyle-UI/${AUI_VERSION}/src/app/${this.path}`;
    const file = this.files[index];
    return `${host}/${fileName}.${file.type}.${file.ext}`;
  }

  openPostStackblitz() {
    const data = forkJoin(
      this.http.get(this.url(0), { responseType: 'text' }),
      this.http.get(this.url(1), { responseType: 'text' }),
      this.http.get(this.url(2), { responseType: 'text' }),
    );
    data.subscribe(([res1, res2, res3]) => {
      const otherModules = `/** Angular */
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/** Alyle UI */
import { LyThemeModule, LyCommonModule, LyThemeConfig, LY_THEME_CONFIG, LyHammerGestureConfig } from '@alyle/ui';
import { MinimaTheme } from '@alyle/ui/themes/minima';
`;
      const AppModule = otherModules + res3.replace(MODULE_REGEXP, (str, token) => {
        return str
        .replace(token, 'AppModule');
      }).replace(EXPORTS_REGEXP, '')
      .replace(IMPORTS_POINT_REGEXP, (str) => {
        return str + `BrowserModule,
    BrowserAnimationsModule,
    LyThemeModule.setTheme('minima-dark'),
    `;
      }).replace(DECLARATIONS_REGEXP, (str, token) => {
        return `bootstrap: [${token}],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: LyHammerGestureConfig
    },
    {
      provide: LY_THEME_CONFIG,
      useClass: MinimaTheme
    }
  ],` + str;
      });

      const appComponentTs = res2.replace(SELECTOR_REGEXP, (str, token) => str.replace(token, SELECTOR_APP));
      this.makeForm([res1, appComponentTs, AppModule]);
    });
  }

  makeForm([res1, res2, res3]) {
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('target', '_blank');
    form.setAttribute('action', 'https://run.stackblitz.com/api/angular/v1/');
    const name = this.path.split('/').reverse()[0];
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
        [`app/app.module.ts`]: res3,
        'main.ts': (
          `import './polyfills';\n` +
          `import { BrowserModule } from '@angular/platform-browser';\n` +
          `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\n` +
          `import { AppModule } from './app/app.module';\n` +
          `\n` +
          `platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {\n` +
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
          `<link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet">\n` +
          `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">\n` +
          `<${SELECTOR_APP}></${SELECTOR_APP}>`
        )
      },
      title,
      description: title,
      template: 'angular-cli',
      dependencies: {
        '@alyle/ui': AUI_VERSION,
        '@angular/core': VERSION.full,
        '@angular/common': VERSION.full,
        '@angular/forms': VERSION.full,
        '@angular/http': VERSION.full,
        '@angular/animations': VERSION.full,
        '@angular/platform-browser': VERSION.full,
        '@angular/compiler': VERSION.full,
        '@angular/platform-browser-dynamic': VERSION.full,
        'chroma-js': 'latest',
        'web-animations-js': 'latest',
        'core-js': 'latest',
        'zone.js': 'latest',
        'rxjs': 'latest',
        'hammerjs': (window as any).Hammer.VERSION
      },
      settings: {
        compile: {
          action: 'refresh',
          clearConsole: false
        }
      }
    };

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

    console.log(payload);

    document.body.appendChild(form);
    const btn = document.createElement('input');
    btn.setAttribute('type', 'submit');
    form.appendChild(btn);
    // form.submit();
    btn.click();
    // document.body.removeChild(form);
  }

  createHiddenField(name: string, value: string) {
    const field = document.createElement('input');
    field.setAttribute('type', 'hidden');
    field.setAttribute('value', value);
    field.setAttribute('name', name);
    return field;
  }

  openStackblitz() {
    const payload = {
      files: {
        'index.html': 'hello',
        '.angular-cli.json': `{
          "apps": [{
            "styles": [
              "styles.css"
              ]
          }]
        }`,
        'main.ts': 'console.log(1)'
      },
      title: 'Angular Project',
      description: 'rasdf',
      // template: 'angular-cli',
      dependencies: {
        '@alyle/ui': '*'
      }
    };
    // sdk.openProjectId('angular', {
    //   newWindow: true
    // });
    // this.http.post('https://run.stackblitz.com/api/angular/v1/', payload).pipe(take(1)).subscribe();
    // const newWindow = window.open(`/api`, `_blank`);
    // this.getFile(2).pipe(
    //   tap(next => {
    //     if (this.getModules(next).length) {
    //       console.log(this.getModules(next));

    //       newWindow.document.write(this._payload(this.getModules(next)));
    //     }
    //   })
    // ).subscribe();
  }

  getModules(str: string) {
    const math = str.match(/from\s\'[@\w\/]+\'+/g);
    if (math) {
      return math.map(_ => _.replace(/\'/g, '').replace(`from `, ''))
      .map(_ => {
        if (_.startsWith('@angular')) {
          return {
            name: _,
            version: VERSION.full
          };
        } else if (_.startsWith('@alyle')) {
          return {
            name: _,
            version: AUI_VERSION
          };
        }
      });
    }
    return [];
  }

  encode(str: string) {
    const buf = [];

    for (let i = str.length - 1; i >= 0; i--) {
      buf.unshift(['&#', str[i].charCodeAt(0), ';'].join(''));
    }

    return buf.join('');
  }

  private _file(path: string, data: string) {
    return (
      `<input type="hidden" name="[files][${path}]" value="${this.encode(data)}">`
    );
  }

  _payload(modules: {
    name: string;
    version: string;
  }[]) {
    const fonts = `<link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet">\n` +
    `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">\n`;
    const maints = (
      `import './polyfills';\n` +
      `import { NgModule } from '@angular/core';\n` +
      `import { BrowserModule } from '@angular/platform-browser';\n` +
      `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\n` +
      `import { BrowserAnimationsModule } from '@angular/platform-browser/animations';\n` +
      `\n` +
      `@NgModule({\n` +
      `  imports: [\n` +
      `    BrowserModule,\n` +
      `    BrowserAnimationsModule,\n` +
      `  ],\n` +
      `  entryComponents: [${toPascalCase(this.name)}Example],\n` +
      `  declarations: [${toPascalCase(this.name)}Example],\n` +
      `  bootstrap: [${toPascalCase(this.name)}Example],\n` +
      `  providers: []\n` +
      `})\n` +
      `export class AppModule {}\n` +
      `platformBrowserDynamic().bootstrapModule(AppModule);\n`
    );

    const dependencies = JSON.stringify({
      '@alyle/ui': AUI_VERSION,
      '@angular/core': VERSION.full,
      '@angular/common': VERSION.full,
      '@angular/forms': VERSION.full,
      '@angular/http': VERSION.full,
      '@angular/animations': VERSION.full,
      '@angular/platform-browser': VERSION.full,
      '@angular/compiler': VERSION.full,
      '@angular/platform-browser-dynamic': VERSION.full,
      'node-vibrant': 'latest',
      'chroma-js': 'latest',
      'web-animations-js': 'latest',
      'core-js': 'latest',
      'zone.js': 'latest',
      'rxjs': 'latest',
      'hammerjs': (window as any).Hammer.VERSION
    });
    const polyfill = `import 'core-js/es6/reflect';\nimport 'core-js/es7/reflect';\nimport 'zone.js/dist/zone';\nimport 'hammerjs';\nimport 'web-animations-js';\n`;
    return `
    <html lang="en">
    <head></head>
    <body>

    <form id="mainForm" method="post" action="https://run.stackblitz.com/api/angular/v1/" target="_self">
    ${this._file('main.ts', maints)}
    ${this._file('index.html', fonts)}
    ${this._file('polyfills.ts', polyfill)}
    ${this._file(`files][app/${this.name}-example.css`, '')}
    ${this._file(`files][app/${this.name}-example.ts`, '')}
    ${this._file(`files][app/${this.name}-example.html`, '')}
    ${this._file(`files][app/${this.name}-example.module.ts`, '')}
    <input type="hidden" name="[files][app/${this.name}-example.ts]" value="${this.encode(polyfill)}">
    <input type="hidden" name="[tags][]" value="Angular">
    <input type="hidden" name="[tags][]" value="Alyle">
    <input type="hidden" name="[tags][]" value="${this.name}">
    <input type="hidden" name="[description]" value="${this.name} Example">
    <input type="hidden" name="[dependencies]" value="${this.encode(dependencies)}">
    <input type="hidden" name="[template]" value="angular-cli">
    <input type="hidden" name="[settings]" value="{&quot;compile&quot;:{&quot;clearConsole&quot;:false}}">
    </form>
    <script>document.getElementById("mainForm").submit();</script>

    </body></html>
    `;
  }

  ngOnInit() {
    this.classes = this.theme.addStyleSheet(styles, 'codeView');
    this.name = this.router.url.replace(/\//g, '').replace(/component/, '');
    if (isDevMode() && !this.path) {
      this.folderName = this.el.nativeElement.querySelector('.tab-container > *').nodeName.toLowerCase();
      console.warn('required path for', this.router.url, this.folderName);
    }
    this.files.forEach((item, i) => {
      this.files[i]['text'] = this.getFile(i);
    });
  }

}
