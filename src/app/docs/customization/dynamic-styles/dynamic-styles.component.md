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

<p>
  Some features:
</p>

<ul>
  <li>Collision-free selectors.</li>
  <li>Support for RTL/LTR.</li>
  <li>Support for SSR (server-side rendering)</li>
  <li>Reusable styles.</li>
  <li>Theming with custom properties.</li>
</ul>

<h2 lyTyp="headline" gutter>Basic style sheet</h2>

<p>
  To create style sheet where some need the configuration of the theme, you can create it in the following way.
</p>

```ts
const styles = (theme: ThemeVariables) => ({
  // Style name, is optional, this is used to add a prefix to all classes,
  // it will only be seen in dev mode
  $name: 'example',
  // this would be like the name of the class
  demo: {
    color: theme.primary.default,
    // support for direction rtl/ltr
    borderBefore: '2px solid',    // css-ltr: border-left, css-rtl: border-right
    paddingBefore: '.5em',        // css-ltr: padding-left, css-rtl: padding-right
    '&:hover': {                  // \`&\` is equal to \`demo\` and therefore it would be 'demo:hover'
      color: theme.accent.default
    }
  },
  buttonLink: {
    color: theme.primary.default,
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
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
const STYLE_BORDER = ({
  height: '120px',
  width: '120px',
  background: '#ffe259',
  backgroundImage: `linear-gradient(${
    [
      '45deg',
      '#ffe259 0%`',
      '#ffa751 100%'
    ].join()
  })`,
  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
});
```

<demo-view path="docs/customization/dynamic-styles/ds-css-declarations-block">
  <aui-ds-css-declarations-block></aui-ds-css-declarations-block>
</demo-view>