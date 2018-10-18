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

const MODULE_REGEXP = /export\sclass\s([\w]+)Module/;
const EXPORTS_REGEXP = /exports\:\s?\[[\w]+\]\,?([\s]+)?/;
const IMPORTS_POINT_REGEXP = /imports\:?(?:[\s]+)?\[(?:[\s]+)?/;
const DECLARATIONS_REGEXP = /declarations: \[\:?(?:[\s]+)?([\w]+)(?:[\s]+)?\]/;
const SELECTOR_REGEXP = /selector: \'([\w-]+)\'/;
const SELECTOR_APP = 'root-app';

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
  classes = this.theme.addStyleSheet(styles, 'demo-view');
  hasCode = false;
  name: string;
  folderName: string;
  demos: {label: string, url: string, ext: string}[] = [];
  files = [
    {label: 'Html', type: 'component', ext: 'html'},
    {label: 'Component', type: 'component', ext: 'ts'},
    {label: 'Module', type: 'module', ext: 'ts'}
  ];
  @Input() viewLabel: string;
  @Input() path: string;
  constructor(
    private http: HttpClient,
    private el: ElementRef,
    private router: Router,
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

  openPostStackblitz(event) {
    const win = window.open('about:blank', '_blank');
    win.document.write('Loading...');
    const data = forkJoin(
      this.http.get(this.url(0), { responseType: 'text' }),
      this.http.get(this.url(1), { responseType: 'text' }),
      this.http.get(this.url(2), { responseType: 'text' }),
    );
    data.subscribe(([res1, res2, res3]) => {
      const otherModules = `/** Angular */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/** Alyle UI */
import { LyThemeModule, LY_THEME, LY_THEME_GLOBAL_VARIABLES } from '@alyle/ui';
import { MinimaLight } from '@alyle/ui/themes/minima';

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
      useClass: MinimaLight
    },
    {
      provide: LY_THEME_GLOBAL_VARIABLES,
      useClass: GlobalVariables
    } // global variables
  ],` + str;
      });

      const appComponentTs = res2.replace(SELECTOR_REGEXP, (str, token) => str.replace(token, SELECTOR_APP));
      const form = this.makeForm([res1, appComponentTs, AppModule], moduleName);
      win.document.body.appendChild(form);
      form.submit();
      win.document.close();
    });
  }

  makeForm([res1, res2, res3], moduleName: string) {
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

  ngOnInit() {
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
