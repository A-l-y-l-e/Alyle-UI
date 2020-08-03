# Sizing

Easily resize an element with width and height utilities.

```html
<div [size]="250"> -> width: 250px; height: 250px
```

> To add a responsive value see [here](/styles/inline-media-query).


## Supported values

```html
<div [width]="1/4">   -> Numbers between 0 and 1 are multiplied by 100 and converted to % values.
                         Result: 25%
<div [width]="300">   -> Numbers are converted to pixel values.
                         Result: 300px
<div [width]="'10'">  -> Numbers in a string without a suffix are converted as above.
                         Result: 10px
<div [width]="'75%'"> -> Numbers in a string with a suffix are used as raw CSS.
                         Result: 75%
<div [width]="1">     -> Result: 100%
<div [width]="null">  -> remove the previously defined style.
```

And this is valid for `minWidth`, `maxWidth`, `height`, `maxHeight`, `minHeight` and `size`.
