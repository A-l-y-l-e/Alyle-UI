# Multiple Themes

Having defined several themes, it is possible to use several themes in a `@NgModule`, `@Component` or `@Directive`, for this we will use Angular Dependency injection (DI).

In the following example we will use the minima-dark and minima-light themes.

> Note that if we use the same theme that is currently being used when changing that theme, both will be changed, so that this does not happen we can clone the theme with a new name.

```ts
import {
  LyTheme2,
  StyleRenderer,
  LY_THEME,
  LY_THEME_NAME } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

export class NewMinimaLight extends MinimaLight {
  name = 'new-minima-light';
}
export class NewMinimaDark extends MinimaDark {
  name = 'new-minima-dark';
}


@Directive({
  selector: '[with-minima-light]',
  providers: [
    LyTheme2,
    StyleRenderer,
    { provide: LY_THEME_NAME, useValue: 'new-minima-light' }
  ]
})
export class WithLightTheme { }

@Directive({
  selector: '[with-minima-dark]',
  providers: [
    LyTheme2,
    StyleRenderer,
    { provide: LY_THEME_NAME, useValue: 'new-minima-dark' }
  ]
})
export class WithDarkTheme { }

@NgModule({
  providers: [
    { provide: LY_THEME, useClass: NewMinimaLight, multi: true },
    { provide: LY_THEME, useClass: NewMinimaDark, multi: true }
  ]
})
export class MultipleThemesDemo01Module { }
```

```html
<ly-card with-minima-dark bg="background:primary" color="text">
  I'm dark theme
    <ly-card with-minima-light bg="background:primary" color="text">
      I'm light theme
    </ly-card>
</ly-card>
<ly-card with-minima-light bg="background:primary" color="text">
  I'm light theme
</ly-card>
```



<demo-view path="components/multiple-themes/multiple-themes-demo-01">
  <multiple-themes-demo-01></multiple-themes-demo-01>
</demo-view>