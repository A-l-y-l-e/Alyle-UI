<!-- Customize Alyle UI with your own theme. You can change the colors, add styles and much more. -->

<!-- It allows you to change the entire look of your app with just modifying variables. -->

You can customize the appearance of a component by replacing styles or adding new styles.

<h2 lyTyp="headline" gutter>How to customize a component</h2>

For example the button component, I can add a rounded style in this way:

```ts
import {
  ...
  PartialThemeVariables,
  lyl } from '@alyle/ui';

export class GlobalVariables implements PartialThemeVariables {
  ...
  button = {
    root: () => lyl `{
      border-radius: 2em
    }`
  };
}
```

> It should be noted that this style will be added globally

We must keep in mind that when we extend a theme, styles can be replaced or added one over another.

For example si declaro los estilos en el tema minima-dark, y despues tambien declaro en GlobalVariables, el estilo que se renderizar será el que esta en Global variables. Esto es un comportamiento predeterminado, para renderizen ambos estilos puede usar `StyleCollection`.

```ts
import {
  ...
  PartialThemeVariables,
  StyleCollection,
  lyl } from '@alyle/ui';

export class CustomMinimaLight {
  name = 'minima-light';
  button = {
    root: () => lyl `{
      ...
    }`
  };
}

export class GlobalVariables {
  button = {
    root: () => lyl `{
      ...
    }`
  };
}
```