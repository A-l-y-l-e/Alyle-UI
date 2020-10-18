# Spacing

Spacing utilities are useful for adding responsive padding and the margin of an element.

```html
<div [lyM]="2 1@XSmall">
```

> To add a responsive value see [here](/styles/inline-media-query).

## Inputs

These are the shorthand attributes that can be used in an element. If the value is a **number then it is multiplied by 8** and converted to pixel values ​​otherwise if it is a **number in a string without a suffix** the value will be used as raw CSS.

* `lyP` - Defines the `padding` style property.
* `lyPf` - Defines the `padding-after` style property.
* `lyPe` - Defines the `padding-before` style property.
* `lyPt` - Defines the `padding-top` style property.
* `lyPb` - Defines the `padding-bottom` style property.
* `lyPx` - Defines the `padding-left` & `padding-right` style property.
* `lyPy` - Defines the `padding-top` & `padding-bottom` style property.
* `lyM` - Defines the `margin` style property.
* `lyMf` - Defines the `margin-after` style property.
* `lyMe` - Defines the `margin-before` style property.
* `lyMt` - Defines the `margin-top` style property.
* `lyMb` - Defines the `margin-bottom` style property.
* `lyMx` - Defines the `margin-left` & `padding-right` style property.
* `lyMy` - Defines the `margin-top` & `margin-bottom` style property.

## Supported values

```html
<div [lyP]="2">     -> 2 * 8 = 16px
<div [lyP]="'2'">   -> 2 * 8 = 16px. Why?
                     Because a number in a string with no suffix is ​​used as a number
                     and then converted to pixel values.
<div [lyP]="'2em'"> -> 2em
<div [lyP]="null">  -> remove the previously defined style.
```

> To add a responsive value see [here](/styles/inline-media-query).
