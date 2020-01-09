# Responsive
{@path /components}

Shows or hides elements.

You can use the `[display]` or `[lyStyle]` attribute to show and hide items.

e.g.

```html
<!-- Only shown for tablet and web -->
<button display="none block@Tablet@Web">Button</button>
<button lyStyle="display:none display:block@Tablet@Web">Button</button>
```

<demo-view path="docs/layout/responsive/responsive-demo-01">
  <responsive-demo-01></responsive-demo-01>
</demo-view>

<h2 lyTyp="headline" gutter>Responsive with dynamic styles</h2>
<demo-view path="docs/layout/responsive/responsive-with-ds">
  <aui-responsive-with-ds></aui-responsive-with-ds>
</demo-view>
