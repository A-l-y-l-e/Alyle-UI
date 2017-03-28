## Tabs
```html
<ly-tab-group [(selectedIndex)]="index">
  <ly-tab *ngFor="let tab of tabs">
    <ly-tab-label>{{ tab.label }}</ly-tab-label>
    {{ tab.content }}
  </ly-tab>
</ly-tab-group>
```
