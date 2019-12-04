# Color

`Color` provides a basic API to manipulate color.

`alpha`, `luminance`, `saturate`, `desaturate`, `darken` and `brighten` are the methods that includes `Color`.

## How to use `Color`

```ts
import { Color } from '@alyle/ui/color';

const Yellow = new Color(255, 255, 0);
```

Using methods:

```ts
const Yellow = new Color(255, 255, 0);
Yellow.darken(2).alpha(.94).css(); // --> rgba(145,156,0,0.94)
```

```ts
(new Color(0xffffff)).luminance(); // --> 1
(new Color(0xffffff)).luminance(0.5); // --> rgb(194,194,0)
```


