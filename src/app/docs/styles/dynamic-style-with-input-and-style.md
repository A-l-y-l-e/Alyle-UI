# Dynamic style with `@Input` and `@Style`

Using the `@Style` decorator, you can create styles with the value of `@Input`.

If the value is null or undefined, it will remove if there is a previously defined style.

For instance:

```ts
import { Component, Input } from '@angular/core';
import { Style, StyleRenderer, Lyl, WithStyles } from '@alyle/ui';
 
@Component({
  selector: '',
  template: '<ng-content></ng-content>',
  providers: [
    StyleRenderer
  ]
})
export class MyComponent implements WithStyles {
  @Input()
  @Style<number | null>(
    (value) => () => lyl `{
      font-size: ${value || 14}px
    }`
  ) fontSize: number | null;

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
```

```html
<!-- font-size: 16 -->
<my-component [fontSize]="16">Content</my-component>

<!-- font-size: 14 -->
<my-component fontSize>Content</my-component>

<!-- fontSize = 16, then it changes to null -->
<!-- therefore, the style will be removed -->
<my-component [fontSize]="fontSize">Content</my-component>
```

Alyle UI already contains directives to customize any element, such as [Sizing](./styles/sizing)

