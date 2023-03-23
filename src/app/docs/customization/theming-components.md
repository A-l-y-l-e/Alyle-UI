# Theming Components

You can customize the appearance of a component by replacing styles or adding new styles.

## How to theming a component

For example, the button component, you can add a rounded style like this:

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

When we extend a theme, styles can be replaced or added one over another.

For example if I declare the styles in the `minimal-dark` theme, and also declare in `GlobalVariables`, both styles render, because was initially declared in the theme.

The following example shows how both styles are rendered.

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
      property: value
    }`
  };
}

export class GlobalVariables {
  button = {
    root: () => lyl `{
      border-radius: 2em
    }`
  };
}
```

This happens because `StyleCollection` was initially declared.

Instead if I add a style with `StyleCollection`, the previous styles will be omitted.

For instance:

```ts
import {
  ...
  PartialThemeVariables,
  StyleCollection,
  lyl } from '@alyle/ui';

export class CustomMinimaLight {
  name = 'minima-light';
  button = {
    // This style is not rendered.
    // Because `StyleCollection` is declared in `GlobalVariables.button`,
    // thus this style will be overridden
    root: () => lyl `{
      border-radius: 8px
      prop: value
    }`;
  };
}

export class GlobalVariables {
  button = {
    // This will be rendered.
    root: new StyleCollection(() => lyl `{
      text-transform: uppercase
    }`);
  };
}
```

> Note that all components have initially declared `StyleCollection`.

## Customizing a Component

When you need to customize a component within another component, without applying the changes globally, you can add the styles to the parent component. Here's an example:

```ts
import { lyl, StyleRenderer, ThemeVariables, SelectorsFn } from '@alyle/ui';
import { STYLES as BUTTON_STYLES } from '@alyle/ui/button';

const STYLES = (theme: ThemeVariables, selectors: SelectorsFn) => {
  // get selectors
  const button = selectors(BUTTON_STYLES);
  return {
    root: lyl `{
      ${button.root} {
        border-radius: 2em
      }
    }`
  }
};

@Component({
  ...
  providers: [
    // Don't forget to add this whenever you are going to use 
    // `StyleRenderer`on the component
    StyleRenderer
  ]
})
export class MyComponent implements WithStyles {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
```

```html
<button ly-button raised bg="primary">Round button</button>
<button ly-button raised bg="primary">Round button</button>
```
