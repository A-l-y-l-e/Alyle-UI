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
      subTitle: {
        fontFamily: \`'Nunito', sans-serif\`,
        textAlign: 'center',
        paddingAbove: '1em',
        opacity: .6,
        fontSize: '32px',
        fontWeight: 400
      }
    }
  };
}
```

<p>
  You can use it like this
</p>

```html
<h2 lyTyp="subTitle">Hello</h2>
```
<h2 lyTyp="headline" gutter>Truncate text</h2>

<demo-view path="docs/components/typography-demo/truncate-text">
  <aui-truncate-text></aui-truncate-text>
</demo-view>
