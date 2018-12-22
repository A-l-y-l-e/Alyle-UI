import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-typography-demo',
  templateUrl: './typography-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypographyDemoComponent implements OnInit {
  codeCustomTyp = `export class GlobalVariables implements PartialThemeVariables {
  ...
  typography = {
    lyTyp: {
      subTitle: {
        fontFamily: \`'Nunito', sans-serif\`,
        textAlign: 'center',
        paddingAbove: '1em',
        opacity: .6,
        fontSize: '32px',
        fontWeight: 400
      }
    }
  };
}
`;
  codeCustomTypTemplate = `<h2 lyTyp="subTitle">Hello</h2>`;
  constructor() { }

  ngOnInit() {
  }

}
