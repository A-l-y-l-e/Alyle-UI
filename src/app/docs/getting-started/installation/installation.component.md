
<p>
  For getting started a new project use <a
  target="_blank"
  rel="noopener nofollow"
  href="https://cli.angular.io/">Angular CLI</a> and for an existing one follow the next steps.
</p>

> Please note that as of version 2.9.0 you have support for Angular 8. If your project uses Angular 7, then use version 2.7.8

<h2 [lyTyp]="'display1'" gutter>Angular CLI</h2>
<p>
  Using with the Angular CLI command will update your Angular project so that it is ready to be used.
</p>

```bash
ng add @alyle/ui
```

<h2 lyTyp="display1" gutter>Manually</h2>

<h2 lyTyp="headline" gutter>Step 1: Install Alyle UI</h2>

```bash
yarn add @alyle/ui
```

<p>or</p>

```bash
npm install --save @alyle/ui
```

<h2 lyTyp="headline" gutter>Step 2: Import Alyle UI in AppModule</h2>

> Note: the themes must be added in the root module of the application, not in sub modules.

```ts
...
/** Import animations */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Import Alyle UI */
import {
  LyThemeModule,
  LY_THEME
} from '@alyle/ui';

/** Import the component modules */
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
...

/** Import themes */
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

@NgModule({
  ...
  imports: [
    ...
    // Animations
    BrowserAnimationsModule,
    // Set main theme
    LyThemeModule.setTheme('minima-light'),
    // Add components
    LyButtonModule,
    LyToolbarModule,
    LyResizingCroppingImageModule
    ...
  ],
  /** Add themes */
  providers: [
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true } // name: `minima-dark`
  ]
  ...
})
export class AppModule { }
```

This library uses Roboto Font & Google's Material Icons, you can add this in `src/index.html`

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons" rel="stylesheet">
```

<h2 lyTyp="headline" gutter>Step 3: Install HammerJs</h2>

<p>
  The <code class="html"><ly-carousel></code> and <code class="html"><ly-img-cropper></code> components require <a href="http://hammerjs.github.io/">HammerJs</a> for gestures.
</p>

```bash
yarn add hammerjs
```

<p>or</p>

```bash
npm install --save hammerjs
```

Import in `src/main.ts`

```ts
import 'hammerjs';
```

<h2 lyTyp="headline" gutter>Step 4: Applies styles to AppComponent</h2>

This applies styles using the theme variables to the `<body>` element.

```ts
import { LyTheme2, ThemeVariables, lyl } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => ({
  $global: lyl `{
    body: {
      background-color: ${theme.background.default}
      color: ${theme.text.default}
      font-family: ${theme.typography.fontFamily}
      margin: 0
      direction: ${theme.direction}
    }
  }`
});

@Component({...})
export class AppComponent {
  readonly classes = this.theme.renderStyleSheet(STYLES);
  constructor(
    private theme: LyTheme2
  ) { }
}
```

<h2 lyTyp="headline" gutter>Step 5: Use the components</h2>

```html
<button ly-button raised>Hello World</button>
```
