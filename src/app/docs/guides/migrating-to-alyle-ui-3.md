# Migrating to Alyle UI 3

Alyle UI 3 has significant changes, so it requires some changes in its code.

> If you are new using the Alyle UI, ignore this.

## Using `@alyle/ui/color` instead `chroma.js`

Alyle UI components no longer use Chroma js, instead use [`Color`](./customization/color). [`Color`](./customization/color) is an Alyle UI library, with basic functions to manipulate color.

Now the colors defined in the themes are no longer a strings, to define a color you can use [`Color`](./customization/color).

Before:

```ts
export class CustomMinimaLight implements PartialThemeVariables {
  name = 'minima-light';
  primary = {
    default: 'rgba(156, 39, 176, 0.94)',
    contrast: '#fff'
  };
  accent = {
    default: '#e91e63',
    contrast: '#fff'
  };
}
```

After:

```ts
export class CustomMinimaLight implements PartialThemeVariables {
  name = 'minima-light';
  primary = {
    default: new Color(156, 39, 176, 0.94),
    contrast: new Color(0xffffff)
  };
  accent = {
    default: new Color(0xe91e63)
    contrast: new Color(0xffffff)
  };
}
```

## Dinamic Styles

The new feature of Alyle UI 3, is that now styles support template string.

For example, before styles were objects:

```ts
const STYLES = (theme: ThemeVariables) => {
  return {
    root: {
      color: 'blue',
      ['{active}']: {
        color: 'red'
      }
    },
    active: null
  }
};
```

Now it can be done this way:

```ts
const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES); // --> {root: '.root-a', active: '.active-b'}
  return {
    root: () => lyl `{
      color: blue
      ${__.active} {
        color: red
      }
    }`,
    active: null
  }
};
```

Let's see another example:

Before:

```ts
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const styles = (theme: ThemeVariables) => ({
  '@global': {
    body: {
      backgroundColor: theme.background.default,
      color: theme.text.default,
      fontFamily: theme.typography.fontFamily,
      margin: 0,
      direction: theme.direction
    }
  }
});
```
After:

```ts
import { LyTheme2, lyl, ThemeVariables } from '@alyle/ui';

const styles = (theme: ThemeVariables) => ({
  $global: lyl `{
    body {
      background-color: ${theme.background.default}
      color: ${theme.text.default}
      font-family: ${theme.typography.fontFamily}
      margin: 0
      direction: ${theme.direction}
    }
  }`
});
```

> Note that the properties of the CSS statements are of the kebab-case format.

## Renaming Image cropper

The Image Cropper had a bad name and was very long. That's why we now rename `LyResizingCroppingImages` to `LyImageCropper` & `@alyle/ui/resizing-cropping-images` to `@alyle/ui/image-cropper`. The selector can be used both <code class="html"><ly-img-cropper></code> and <code class="html"><ly-image-cropper></code>





