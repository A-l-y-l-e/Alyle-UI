<p>
  All components of Alyle UI are made with dynamic styles. With this feature it is possible to create more custom styles for Angular components.
</p>

Features:

* Collision-free selectors.
* Reusable styles.
* Theming with custom properties.
* Support for SSR (server-side rendering)
* Support for RTL/LTR.

<h2 lyTyp="headline" gutter>Basic style sheet</h2>

To create style sheet where some need the configuration of the theme, you can create it in the following way.

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

> Note that the semicolon after a CSS declaration is optional.

<p>
  Example:
</p>
<demo-view path="docs/customization/dynamic-styles/ds-basic">
  <aui-ds-basic></aui-ds-basic>
</demo-view>

<h2 lyTyp="headline" gutter>Basic style</h2>
<p>
  This is like a CSS declarations block.
</p>

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

<h2 lyTyp="headline" gutter>Nesting</h2>

With Alyle UI it is possible to nest your selectors and you can use it with `&` to get the parent selector.

<demo-view path="docs/customization/dynamic-styles/ds-nesting">
  <aui-ds-nesting></aui-ds-nesting>
</demo-view>
