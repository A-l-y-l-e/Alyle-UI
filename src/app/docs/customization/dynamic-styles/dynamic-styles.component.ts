import { Component } from '@angular/core';

@Component({
  selector: 'aui-dynamic-styles',
  templateUrl: './dynamic-styles.component.html'
})
export class DynamicStylesComponent {
  codeBasicStyle = `
const styles = (theme: ThemeVariables) => ({
  // Style name, is optional, this is used to add a prefix to all classes,
  // it will only be seen in dev mode
  $name: 'example',
  demo: {                         // this would be like the name of the class
    color: theme.primary.default, // style
    borderStart: '2px solid',     // support for rtl & ltr
    paddingStart: '.5em',         // support for rtl & ltr
    '&:hover': {                  // \`&\` is equal to \`demo\` and therefore it would be 'demo:hover'
      color: theme.accent.default // style
    }
  },
  buttonLink: {
    color: theme.accent.default,
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});
`;
}
