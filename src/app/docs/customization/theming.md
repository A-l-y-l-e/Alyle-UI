# Theming

## Overwriting the variables of a theme
<p>
  <code>MinimaLight & MinimaDark</code> are already created themes, you can edit and add new variables.
</p>
<p>
  To overwrite a theme, you must create a new class and add the property <code>name</code> where the value is equal to the name of the theme to be overwritten.
</p>

```ts
...
import {
  LyThemeModule,
  LY_THEME,
  LY_THEME_GLOBAL_VARIABLES,
  PartialThemeVariables
} from '@alyle/ui';
import { color } from '@alyle/ui/color';

import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

/**
 * For light theme
 * Theme name = minima-light
 */
export class CustomMinimaLight implements PartialThemeVariables {
  name = 'minima-light';
  primary = {
    default: color(0x2196f3),
    contrast: color(0xffffff)
  };
  accent = {
    default: color(0xe91e63),
    contrast: color(0xffffff)
  };
}

/**
 * For dark theme
 * Theme name = minima-dark
 */
export class CustomMinimaDark implements PartialThemeVariables {
  name = 'minima-dark';
  primary = {
    default: color(0x9c27b0),
    contrast: color(0xffffff)
  };
  accent = {
    default: color(0x69f0ae),
    contrast: color(0x202020)
  };
}

/**
 * Global variables
 * This replaces the variables to all the themes,
 * you can also add new variables.
 */
export class GlobalVariables implements PartialThemeVariables {
  SublimeLight = {
    default: `linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)`,
    contrast: color(0xffffff),
    shadow: color(0xB36FBC)
  }; // demo: <button ly-button raised bg="SublimeLight">Button</button>
  button = {
    root: lyl `{
      border-radius: 2em
    }`
  };
}

/** set theme */
@NgModule({
  ...
  imports: [
    LyThemeModule.setTheme('minima-dark')
  ],
  provides: [
    ...
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name minima-light
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name minima-dark
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true }, // name minima-light
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true }, // name minima-dark
    { provide: LY_THEME_GLOBAL_VARIABLES, useClass: GlobalVariables } // global variables
  ]
  ...
})
export class AppModule { }
```

<p>
  You can combine the types of the themes. This can be useful at the time of using the variables, since all the declared variables will be available. For example:
</p>

```ts
// app.module.ts
export type AppThemeVariables = MinimaLight
  & MinimaDark
  & CustomMinimaLight
  & CustomMinimaDark
  & GlobalVariables;

// app.component.ts
const styles = (theme: AppThemeVariables) => ({
  $global: lyl `{
    body {
      ...
      color: ${theme.text.default}
    }
  }`
});
```

<h2 lyTyp="headline" gutter>Typography</h2>

<p>
  By default use Roboto Font, you can change the font.
</p>

```ts
export class GlobalVariables implements PartialThemeVariables {
  ...
  typography = {
    fontFamily: `'Open Sans', sans-serif`
  };
  ...
}
```

<p>
  Note: do not forget to change the font in `index.html`.
</p>

<p>
  <a [routerLink]="'/components/typography'">Here</a> you can find more about Typography.
</p>
