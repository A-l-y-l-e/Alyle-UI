# Installation

<p>
  For getting started a new project use <a
  target="_blank"
  rel="noopener nofollow"
  href="https://cli.angular.io/">Angular CLI</a> and for an existing one follow the next steps.
</p>

> Please note that as of version 2.9.0 you have support for Angular 8. If your project uses Angular 7, then use version 2.7.8. There is no longer support for Angular 7.

## Angular CLI
<p>
  Using with the Angular CLI command will update your Angular project so that it is ready to be used.
</p>

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
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
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
    LyImageCropperModule
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

### Step 3: Applies styles to AppComponent

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
  readonly classes = this.styleRenderer.addSheet(STYLES);
  constructor(
    private styleRenderer: StyleRenderer
  ) { }
}
```

### Step 4: Use the components

```html
<button ly-button raised>Hello World</button>
```
