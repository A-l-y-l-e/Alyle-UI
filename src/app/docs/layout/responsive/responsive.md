# Responsive
{@path /components}

Shows or hides elements.

There are two ways for an element to be responsive, using directives or dynamic styles, you can use any of them according to your needs

## Using `LyStyle` directive

You can use the `[lyDisplay]` or `[lyStyle]` attribute to show and hide items. We import `LyCommonModule`, to use this feature.

e.g.

```html
<!-- Only shown for tablet or web -->
<button lyDisplay="none block@Tablet@Web">Button</button>
<button lyStyle="display:none display:block@Tablet@Web">Button</button>

<!-- This will be hidden in `XSmall` -->
<button lyDisplay="none@XSmall">Button</button>

<!-- This will be hidden in `XSmall` or `Small` -->
<button lyDisplay="none@XSmall@Small">Button</button>
```

> To add a responsive value see [here](/styles/inline-media-query).

<demo-view path="docs/layout/responsive/responsive-demo-01">
  <responsive-demo-01></responsive-demo-01>
</demo-view>

## Responsive with dynamic styles 

Alternatively you can create a style sheet.

```ts
// `theme.breakpoints.XSmall` equals `(max-width: 599px)`
const STYLES = (theme: ThemeVariables) => ({
  demo1: lyl `{
    @media ${theme.breakpoints.XSmall} {
      color: ${theme.primary.contrast}
      background-color: ${theme.primary.default}
    }
  }`
})
```

<demo-view path="docs/layout/responsive/responsive-with-ds">
  <aui-responsive-with-ds></aui-responsive-with-ds>
</demo-view>
