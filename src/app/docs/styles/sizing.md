# Sizing

Easily resize an element with width and height utilities.

```html
<div [lySize]="250"> -> width: 250px; height: 250px
```

> To add a responsive value see [here](/styles/inline-media-query).


## Supported values

```html
<div [lyWidth]="1/4">   -> Numbers between 0 and 1 are multiplied by 100 and converted to % values.
                         Result: 25%
<div [lyWidth]="300">   -> Numbers are converted to pixel values.
                         Result: 300px
<div [lyWidth]="'10'">  -> Numbers in a string without a suffix are converted as above.
                         Result: 10px
<div [lyWidth]="'75%'"> -> Numbers in a string with a suffix are used as raw CSS.
                         Result: 75%
<div [lyWidth]="1">     -> Result: 100%
<div [lyWidth]="null">  -> remove the previously defined style.
```

And this is valid for `lyMinWidth`, `lyMaxWidth`, `lyHeight`, `lyMaxHeight` and `lyMinHeight`.
