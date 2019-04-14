Customize Alyle UI with your own theme. You can change the colors, add styles and much more.

It allows you to change the entire look of your app with just modifying variables.

<h2 lyTyp="headline" gutter>Customize a component</h2>

<p>
  In addition to changing some variables of a theme (you can see that in <a
  [routerLink]="['/', 'customization', 'theming']">theming</a>), it is also possible to change and add styles to a theme, styles that affect the components.
</p>

This applies a rounded style to all the buttons.

```ts
export class GlobalVariables implements PartialThemeVariables {
  ...
  button = {
    root: {
      borderRadius: '2em'
    }
  };
}
```

This is possible for most components.
