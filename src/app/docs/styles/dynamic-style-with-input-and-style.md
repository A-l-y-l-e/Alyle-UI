# Dynamic style with `@Input` and `@Style`

Using the `@Style` decorator, you can create responsive styles with the value of `@Input`.

## The responsive decorator `@Style`

The `@Style` decorator extracts the values and the media queries, [here](/styles/inline-media-query) see more about how to extract the values.

If the value is null or undefined, it will remove if there is a previously defined style.

e.g.

```ts
import { Directive, Input } from '@angular/core';
import { Style, StyleRenderer, lyl, WithStyles, ThemeVariables } from '@alyle/ui';

/**
 * @dynamic
 */
@Directive({
  selector: '[lyDisplay]',
  providers: [
    StyleRenderer
  ]
})
export class MyComponent implements WithStyles {
  @Input()
  @Style<string | null>(
    (val, media) => ({breakpoints}: ThemeVariables) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          display: ${val}
        }
      }`
    )
  ) display: string | null;

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
```

```html
<div [lyDisplay]="none@XSmall">       // this is not shown in `XSmall`
<div [lyDisplay]="none@XSmall@Small"> // this is not shown in `XSmall`, nor in `Small`
```

Fortunately Alyle UI contains [`LyStyle`](/api/@alyle/ui/LyStyle) Directive to customize elements.


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
