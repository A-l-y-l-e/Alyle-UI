# Dynamic style with `@Input` and `@Style`

Using the `@Style` decorator, you can create styles with the value of `@Input`.

If the value is null or undefined, it will remove if there is a previously defined style.

For instance:

```ts
import { Component, Input } from '@angular/core';
import { Style, StyleRenderer, Lyl, WithStyles } from '@alyle/ui';

/**
 * @dynamic
 */
@Component({
  selector: 'my-component',
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

## Angular Libraries: Using Lambdas in the Style Decorator

If you are building an angular library that will be deployed to npm you will probably get the following error

```bash
ERROR: /path/lib/my-component/my-component.ts:143:1: Error encountered in metadata generated for exported symbol 'MyComponent': 
 /path/lib/my-component/my-component.ts:225:5: Metadata collected contains an error that will be reported at runtime: Lambda not supported.
```

To avoid that error, you should add a comment with `@dynamic` in the component.

e.g.

```ts
/**
 * @dynamic
 */
@Component({
  ...
})
...
```
