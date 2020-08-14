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
  LY_THEME,
  LY_THEME_NAME,
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
    root: () => lyl `{
      border-radius: 2em
    }`
  };
}

/** set theme */
@NgModule({
  ...
  provides: [
    ...
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
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

You can combine the types of the themes. This can be useful at the time of using the variables, since all the declared variables will be available. For example:

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

## Changing themes at run-time

You can apply a theme at runtime for example, before a theme's styles are rendered you can define the name of the theme.

You can do something like this:

```ts
export function themeNameProviderFactory() {
  if (typeof localStorage === 'object') {
    const themeName = localStorage.getItem('theme-name');
    if (themeName) {
      return themeName;
    }
  }

  // Default theme
  return 'minima-light';
}

@NgModule({
  ...
  providers: [
    ...
    { provide: LY_THEME_NAME, useFactory: themeNameProviderFactory },
  ]
})
export class AppModule { }
```

## Switch themes

If you want you can change the current theme for another.


```ts
@Component({
  ...
})
export class MyComponent {
  constructor(
    private _theme: LyTheme2
  ) { }

  setTheme(themeName: string) {
    this._theme.setTheme(themeName);
  }
}
```

```html
<button ly-button (click)="setTheme('minima-light')">Set Light theme</button>
<button ly-button (click)="setTheme('minima-dark')">Set Dark theme</button>
```

> In order to change the themes it is necessary to have loaded the themes to be used.


## Typography

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
  <a href="/components/typography">Here</a> you can find more about Typography.
</p>
