import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  VERSION,
  isDevMode
} from '@angular/core';
import { Observable, of, merge } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, retry, tap } from 'rxjs/operators';
import { Platform, AUI_VERSION, LyTheme2 } from '@alyle/ui';


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
    const fileName = this.path.split('/').reverse()[0];
    const host = `https://raw.githubusercontent.com/A-l-y-l-e/Alyle-UI/${AUI_VERSION}/src/app/${this.path}`;
    const file = this.files[index];
    return `${host}/${fileName}.${file.type}.${file.ext}`;
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
    const newWindow = window.open(`/api`, `_blank`);
    this.getFile(2).pipe(
      tap(next => {
        if (this.getModules(next).length) {
          console.log(this.getModules(next));

          newWindow.document.write(this._payload(this.getModules(next)));
        }
      })
    ).subscribe();
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
