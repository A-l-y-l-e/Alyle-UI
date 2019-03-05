import { Component } from '@angular/core';

@Component({
  selector: 'aui-dynamic-styles',
  templateUrl: './dynamic-styles.component.html'
})
export class DynamicStylesComponent {
  codeBasicStyleSheet = `
const styles = (theme: ThemeVariables) => ({
  // Style name, is optional, this is used to add a prefix to all classes,
  // it will only be seen in dev mode
  $name: 'example',
  // this would be like the name of the class
  demo: {
    color: theme.primary.default,
    // support for direction rtl/ltr
    borderBefore: '2px solid',    // css-ltr: border-left, css-rtl: border-right
    paddingBefore: '.5em',        // css-ltr: padding-left, css-rtl: padding-right
    '&:hover': {                  // \`&\` is equal to \`demo\` and therefore it would be 'demo:hover'
      color: theme.accent.default
    }
  },
  buttonLink: {
    color: theme.primary.default,
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});
`;

  codeBasicStyle = `const STYLE_BORDER = ({
  height: '120px',
  width: '120px',
  background: '#ffe259',
  backgroundImage: \`linear-gradient(\${
    [
      '45deg',
      \`\${'#ffe259'} 0%\`,
      \`\${'#ffa751'} 100%\`
    ].join()
  })\`,
  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
});
`;

}
