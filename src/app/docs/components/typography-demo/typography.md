# Typography
{@path /components}

Use typography to present your design and content as clearly and efficiently as possible.

<demo-view path="docs/components/typography-demo/typography-demo-basic">
  <aui-typography-demo-basic></aui-typography-demo-basic>
</demo-view>

<h2 lyTyp="headline" gutter>Theme</h2>

<p>
  You can also add new configurations
</p>

```ts
export class GlobalVariables implements PartialThemeVariables {
  ...
  typography = {
    lyTyp: {
      lyTyp: {
        myTitle: () => lyl `{
          font-family: 'Roboto', sans-serif
          text-align: center
          padding-above: 1em
          opacity: .6
          font-size: 32px
          font-weight: 400
        }`
      }
    }
  };
}
```

<p>
  You can use it like this
</p>

```html
<h2 lyTyp="myTitle">Hello</h2>
```
<h2 lyTyp="headline" gutter>Truncate text</h2>

<demo-view path="docs/components/typography-demo/truncate-text">
  <aui-truncate-text></aui-truncate-text>
</demo-view>
