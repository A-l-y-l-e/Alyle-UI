# Sizing

Easily resize an element with width and height utilities.

```html
<div [size]="250"> -> width: 250px; height: 250px
```

## Supported values

```html
<div [width]="1/4">   -> Numbers between 0 and 1 are multiplied by 100 and converted to % values.
<div [width]="300">   -> Numbers are converted to pixel values.
<div [width]="'75%'"> -> String values are used as raw CSS.
<div [width]="1">     -> 100%
<div [width]="null">  -> remove the previously defined style.
```

And the same goes for `minWidth`, `maxWidth`, `height`, `maxHeight`, `minHeight` and `size`.


