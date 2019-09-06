<p>
  Alyle UI uses dynamic styles, for a better control of the styles.
</p>

<p>
  Dynamic styles is inspired by many other CSS-in-JS libraries, like <a
  href="https://cssinjs.org"
  target="_blank"
  rel="noopener nofollow">JSS</a> and <a
  href="https://emotion.sh/"
  target="_blank"
  rel="noopener nofollow">emotion</a>
</p>

Some features:

* Collision-free selectors.
* Reusable styles.
* Theming with custom properties.
* Support for SSR (server-side rendering)
* Support for RTL/LTR.

<h2 lyTyp="headline" gutter>Basic style sheet</h2>

To create style sheet where some need the configuration of the theme, you can create it in the following way.

```ts
const styles = (theme: ThemeVariables) => ({
  // Style name, is optional, this is used to add a prefix to all classes,
  // it will only be seen in dev mode.
  $name: 'example',
  // This would be like the name of the class.
  demo: lyl `{
    color: ${theme.primary.default}
    border-${theme.before}: 2px solid
    padding-${theme.before}: .5em
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
});
```

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
const STYLE_BORDER = lyl `{
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