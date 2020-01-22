# Color

`color` provides a basic API to manipulate color.

`alpha`, `luminance`, `saturate`, `desaturate`, `darken` and `brighten` are the methods that includes `Color`.

## Supported values

```ts
import { color } from '@alyle/ui/color';

const Yellow = color(255, 255, 0);  // rgb
const Black  = color(0);            // number
const White  = color(0xffffff);     // hex
const Text   = color(0, 0, 0, .87); // rgba
```

Note that a 6-digit hexadecimal is different from a 3-digit hexadecimal.

```ts
color(0xffffff).css() !== color(0xfff).css(); // true
```

## How to use `color`

`color` and the previously mentioned methods returns an immutable `Color`.

```ts
import { color } from '@alyle/ui/color';

const Yellow = color(255, 255, 0);
```

Using methods:

```ts
const Yellow = color(255, 255, 0);
Yellow.darken(2).alpha(.94).css(); // --> rgba(145,156,0,0.94)
```

```ts
color(0xffffff).luminance(); // --> 1
color(0xffffff).luminance(0.5); // --> rgb(194,194,0)
```


