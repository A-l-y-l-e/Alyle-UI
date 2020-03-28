# Installation

<p>
  For getting started a new project use <a
  target="_blank"
  rel="noopener nofollow"
  href="https://cli.angular.io/">Angular CLI</a> and for an existing one follow the next steps.
</p>

> Please note that as of version 2.9.0 you have support for Angular 8. If your project uses Angular 7, then use version 2.7.8. There is no longer support for Angular 7.

## Angular CLI

Using with the Angular CLI command will update your Angular project so that it is ready to be used.

```bash
ng add @alyle/ui
```

## Manually

### Step 1: Install Alyle UI

```bash
yarn add @alyle/ui
```

<p>or</p>

```bash
npm install --save @alyle/ui
```

### Step 2: Import Alyle UI in AppModule

```ts
...
/** Import animations */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Gestures
import {
  ...
  HAMMER_GESTURE_CONFIG,
  HammerModule
} from '@angular/platform-browser';

/** Import Alyle UI */
import {
  LyThemeModule,
  LyTheme2,
  StyleRenderer,
  LY_THEME,
  LY_THEME_NAME
} from '@alyle/ui';

/** Import the component modules */
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
...

/** Import themes */
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

@NgModule({
  ...
  imports: [
    ...
    BrowserAnimationsModule,
    // Add components
    LyButtonModule,
    LyToolbarModule,
    LyImageCropperModule
    // Gestures
    HammerModule
  ],
  /** Add themes */
  providers: [
    [ LyTheme2 ],
    [ StyleRenderer ],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
    // Gestures
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
  ]
  ...
})
export class AppModule { }
```

This library uses Roboto Font & Google's Material Icons, you can add this in `src/index.html`

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons" rel="stylesheet">
```

## Step 3: Install HammerJs</h2>

The <code class="html"><ly-carousel></code>, <code class="html"><ly-slider></code> and <code class="html"><ly-img-cropper></code> components require <a href="http://hammerjs.github.io/">HammerJs</a> for gestures.

<prism language="bash" code="yarn add hammerjs"></prism>

<p>or</p>

<prism language="bash" code="npm install --save hammerjs"></prism>

<p>Import in src/main.ts</p>

<prism language="typescript" code="import 'hammerjs';"></prism>

### Step 4: Applies styles to AppComponent

This applies styles using the theme variables to the <code class="html"><body></code> element.

```ts
import { StyleRenderer, ThemeVariables, lyl } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => ({
  $global: lyl `{
    body {
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
  readonly classes = this.styleRenderer.renderSheet(STYLES);
  constructor(
    private styleRenderer: StyleRenderer
  ) { }
}
```

### Step 5: Use the components

```html
<button ly-button raised>Hello World</button>
```
