import { Component } from '@angular/core';

@Component({
  selector: 'aui-dynamic-styles',
  templateUrl: './dynamic-styles.component.html',
  styleUrls: ['./dynamic-styles.component.scss']
})
export class DynamicStylesComponent {
  codeBasicStyle = `
const styles = theme => ({
  root: {                         // this would be like the name of the class
    color: theme.primary.default, // style
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
