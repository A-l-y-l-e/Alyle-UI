import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-typography-demo',
  templateUrl: './typography-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypographyDemoComponent implements OnInit {
  codeCustomTyp = `
`;
  codeCustomTypTemplate = `<h2 lyTyp="subTitle">Hello</h2>`;
  constructor() { }

  ngOnInit() {
  }

}
