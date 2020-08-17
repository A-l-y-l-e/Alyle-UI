# Dynamic Styles

All components of Alyle UI are made with dynamic styles. With this feature it is possible to create more custom styles for Angular components.

Practically the css is in typescript, it's like css-in-js, well in this case it would be css-in-ts.

Features:

* Collision-free selectors.
* Theming with custom properties.
* Reusable styles.
* Nesting selector.
* Support for SSR (server-side rendering)
* Support for RTL/LTR.

## Basic style sheet

This is like a CSS declarations block. 

```ts
import { StyleRenderer, lyl } from '@alyle/ui';

const STYLES = () => ({
  root: lyl `{
    display: block
    height: 120px
    width: 120px
    background: #ffe259
    background-image: linear-gradient(${
      [
        '45deg',
        '#ffe259 0%',
        '#ffa751 100%'
      ].join()
    })
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%
  }`
});

...
export class DsCssDeclarationsBlockComponent {
  // Note that the second argument is true (default false), this will
  // cause the `this.classes.root` class to be automatically added.
  // This avoids using:
  // `renderer.addClass(elementRef.nativeElement, this.classes.root)`
  readonly classes = this.sRenderer.renderSheet(STYLES, true);

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
```

<demo-view path="docs/customization/dynamic-styles/ds-css-declarations-block">
  <aui-ds-css-declarations-block></aui-ds-css-declarations-block>
</demo-view>


## Style sheet with `ThemeVariables`

To create style sheet where some need the `ThemeVariables`, you can create it in the following way.

```ts
const STYLES = (theme: ThemeVariables) => {
  const { before } = theme; // Support of RTL
  return {
    // Style name, is optional, this is used to add a prefix to all classes,
    // it will only be seen in dev mode
    $name: 'example',
    // This would be like the name of the class
    demo: lyl `{
      color: ${theme.primary.default}
      border-${before}: 2px solid
      padding-${before}: .5em
      &:hover {
        color: ${theme.accent.default}
      }
    }`,
    buttonLink: lyl `{
      color: ${theme.primary.default}
      text-decoration: inherit
      &:hover {
        text-decoration: underline
      }
    }`
  };
};
```

And to render we use `StyleRenderer`:

```ts
...
export class MyComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES);

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
```

<demo-view path="docs/customization/dynamic-styles/with-theme-variables">
  <aui-with-theme-variables></aui-with-theme-variables>
</demo-view>

A style statement must be in a single line, since the parser assumes that a single line contains a property and a value, and ignores those identified by the dollar sign, and wrapped in braces (`${expression}`).

e.g

This way is fine:

```ts
lyl `{
  background-image: linear-gradient(${
    [
      '45deg',
      '#ffe259 0%',
      '#ffa751 100%'
    ].join()
  })
}`
```

Bad:

```ts
lyl `{
  background-image: linear-gradient(
    45deg,
    #ffe259 0%,
    #ffa751 100%
  )
}`
```

> Note that the semicolon after a CSS statement is not required.

## Nesting Selector

With Alyle UI it is possible to nest your selectors and you can use it with `&` to get the parent selector.

```ts
lyl `{
  parent {
    child {
      &::after {
        ...
      }
    }
  }
}`
```

Compiled CSS:

```css
.cx parent child::after {
  ...
}
```

This can actually be thought of as short-hand for nesting with the `&`:


<demo-view path="ds-nesting">
  <aui-ds-nesting></aui-ds-nesting>
</demo-view>

## Reusable Styles

```ts
const colorRed = lyl `{
  color: red
}`

const style = lyl `{
  font-size: 14px
  display: inline-block
  ...${colorRed}
}`
```

Compiled CSS:

```css
.ky {
  font-size: 14px;
  display:inline-block;
}
.ky {
  color:red;
}
```

## Media queries

It's the same as CSS media queries.

For instance:

```ts
(theme: ThemeVariables) => lyl `{
  @media ${theme.breakpoints['XSmall']} {
    display: none
  }
}`
```

You can also use [`@Style`](/styles/dynamic-style-with-input-and-style) to create dynamic styles with `@Input`.

## About class names

Class names in development mode are generated with a unique id (like `.LyButton-root-a`) and can change, but in production they change to `.a`.

It should be noted that class names change in both development and production. However, if you want to add a style to a class or to customize a component see [here](/customization/theming-components).

### Prefixing of class names in production

If the class names in production conflict with your classes, you can prefix.

In your `AppModule`:

```ts
@NgModule({
  providers: [
    { provide: LY_CLASS_NAME_PREFIX, useValue: 'app-' }
  ]
})
```

