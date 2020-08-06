# Inline Media Query

Breakpoints can be used in the template and can be very useful for adding a responsive style to an element.

e.g.

```html
<div [m]="2 1@XSmall">
```

The example above can be understood as follows:

```ts
[
  [2 * 8, null],    // margin: 16px without breakpoint
  [1 * 8, 'XSmall'] // margin: 8px in XSmall
]
```

```html
<div [m]="2 1@XSmall@Small">
```

The example above can be understood as follows:

```ts
[
  [2 * 8, null],    // margin: 16px without breakpoint
  [1 * 8, 'XSmall'] // margin: 8px in XSmall
  [1 * 8, 'Small']  // margin: 8px in Small
]
```

It is important to note that each CSS declaration is separated by a space (` `). So there are two styles above. However, if you want to add a CSS declaration that contains multiple spaces you can do it this way:

For example I want to add both `padding: 16px 0px 32px` and `padding: 8px 0px 16px@XSmall`, it would be like this:

```html
<div [p]="[
  '2 0 4',
  '1 0 2@XSmall'
]">
```


