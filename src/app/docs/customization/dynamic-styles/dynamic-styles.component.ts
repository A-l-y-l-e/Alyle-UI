import { Component } from '@angular/core';

@Component({
  selector: 'aui-dynamic-styles',
  templateUrl: './dynamic-styles.component.html'
})
export class DynamicStylesComponent {
  codeBasicStyle = `
const styles = (theme: ThemeVariables) => ({
  demo: {                         // this would be like the name of the class
    color: theme.primary.default, // style
    borderStart: '2px solid',     // support for rtl & ltr
    paddingStart: '.5em',         // support for rtl & ltr
    '&:hover': {                  // \`&\`is equal to \`root\` and therefore it would be 'root:hover'
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
