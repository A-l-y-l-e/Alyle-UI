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

To create style sheet where some need the `ThemeVariables`, you can create it in the following way.

```ts
const STYLES = (theme: ThemeVariables) => {
  const { before } = theme;
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

<demo-view path="docs/customization/dynamic-styles/with-theme-variables">
  <aui-with-theme-variables></aui-with-theme-variables>
</demo-view>

A style statement must be in a single line, since the parser assumes that a single line contains a property and a value, and ignores those identified by the dollar sign, and wrapped in braces (`${expression}`).

e.g

This way is fine:

```ts
const STYLE = lyl `{
  background-image: linear-gradient(${
    [
      '45deg',
      '#ffe259 0%',
      '#ffa751 100%'
    ].join()
  })
}`
```

But this is not:

```ts
const STYLE = lyl `{
  background-image: linear-gradient(
      45deg,
      #ffe259 0%,
      #ffa751 100%
  )
}`
```

> Note that the semicolon after a CSS statement is not required.

## Basic style

This is like a CSS declarations block.

```ts
const STYLE_BORDER = () => lyl `{
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
}`;
```

<demo-view path="docs/customization/dynamic-styles/ds-css-declarations-block">
  <aui-ds-css-declarations-block></aui-ds-css-declarations-block>
</demo-view>

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
parent child::after {
  ...
}
```

This can actually be thought of as short-hand for nesting with the `&`:


<demo-view path="docs/customization/dynamic-styles/ds-nesting">
  <aui-ds-nesting></aui-ds-nesting>
</demo-view>

## Reusable Styles

```ts
const colorRed = lyl `{
  color: red
}`

const style = lyl `{
  font-size: 14px
  ...${colorRed}
}`
```

Compiled CSS:

```css
.selector {
  font-size: 14px;
  color: red;
}
```

## Media queries

It's the same as CSS media queries.

For instance:

```ts
(theme: ThemeVariables) => lyl `{
  @media ${theme.getBreakpoint('XSmall')} {
    display: none
  }
}`
```

You can also use [`@Style`](./styles/dynamic-style-with-input-and-style) to create dynamic styles with `@Input`.
