<h2 lyTyp="headline" gutter>Overwriting the variables of a theme</h2>
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

import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

/**
 * For light theme
 * Theme name = minima-light
 */
export class CustomMinimaLight implements PartialThemeVariables {
  name = 'minima-light';
  primary = {
    default: '#2196f3',
    contrast: '#fff'
  };
  accent = {
    default: '#e91e63',
    contrast: '#fff'
  };
}

/**
 * For dark theme
 * Theme name = minima-dark
 */
export class CustomMinimaDark implements PartialThemeVariables {
  name = 'minima-dark';
  primary = {
    default: '#9C27B0',
    contrast: '#fff'
  };
  accent = {
    default: '#69F0AE',
    contrast: '#202020'
  };
}

/**
 * Global variables
 * This replaces the variables to all the themes,
 * you can also add new variables
 */
export class GlobalVariables implements PartialThemeVariables {
  SublimeLight = {
    default: `linear-gradient(135deg, #FC5C7D 0%, #6A82FB 100%)`,
    contrast: '#fff',
    shadow: '#B36FBC'
  }; // demo: <button ly-button raised bg="SublimeLight">Button</button>
  button = {
    root: lyl `{
      borderRadius: '2em'
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
export type AppTheme = MinimaLight
  & MinimaDark
  & CustomMinimaLight
  & CustomMinimaDark
  & GlobalVariables;

// app.component.ts
const styles = (theme: AppTheme) => ({
  '@global': {
    body: {
      ...
      color: theme.text.default
    }
  }
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
