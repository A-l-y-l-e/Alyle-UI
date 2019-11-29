# Theming Components

You can customize the appearance of a component by replacing styles or adding new styles.

<h2 lyTyp="headline" gutter>How to customize a component</h2>

For example the button component, I can add a rounded style in this way:

```ts
import {
  ...
  PartialThemeVariables,
  lyl } from '@alyle/ui';

export class GlobalVariables implements PartialThemeVariables {
  ...
  button = {
    root: () => lyl `{
      border-radius: 2em
    }`
  };
}
```

> It should be noted that this style will be added globally

We must keep in mind that when we extend a theme, styles can be replaced or added one over another.

For example if I declare the styles in the `minimal-dark` theme, and also declare in `GlobalVariables`, the style that will be rendered will be the one in Global variables. This is a default behavior, to render both styles you can use `StyleCollection`.

```ts
import {
  ...
  PartialThemeVariables,
  lyl } from '@alyle/ui';

export class CustomMinimaLight {
  name = 'minima-light';
  button = {
    root: () => lyl `{
      border-radius: 8px
    }`
  };
}

export class GlobalVariables {
  button = {
    // This override the previous style
    root: () => lyl `{
      border-radius: 2em
    }`
  };
}
```

With `StyleCollection`:

```ts
import {
  ...
  PartialThemeVariables,
  StyleCollection,
  lyl } from '@alyle/ui';

export class CustomMinimaLight {
  name = 'minima-light';
  button = {
    // This will be rendered
    root: new StyleCollection(() => lyl `{
      border-radius: 8px
    }`);
  };
}

export class GlobalVariables {
  button = {
    // and this too
    root: () => lyl `{
      text-transform: uppercase;
    }`
  };
}
```

