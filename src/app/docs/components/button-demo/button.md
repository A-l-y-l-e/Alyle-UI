# Button
{@path /components}

Buttons allow users to take actions, and make choices, with a single tap.

## Disabled links

When `ly-button` is used on an anchor, `[disabled]` sets `aria-disabled="true"`, removes the
link from sequential keyboard navigation, and prevents activation. The authored `tabindex` and
`aria-disabled` values are restored when the link is re-enabled.

```html
<a ly-button href="/settings" [disabled]="isDisabled">Settings</a>
```

## Button types

<demo-view path="docs/components/button-demo/button-types-demo">
  <aui-button-types-demo></aui-button-types-demo>
</demo-view>

## Buttons with icons and label

<demo-view path="docs/components/button-demo/icon-label-buttons">
  <aui-icon-label-buttons></aui-icon-label-buttons>
</demo-view>

## Button with loading state

<demo-view path="docs/components/button-demo/button-with-loading-state">
  <aui-button-with-loading-state></aui-button-with-loading-state>
</demo-view>
