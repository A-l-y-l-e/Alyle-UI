import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'bg-color-demo-01',
  templateUrl: './bg-color-demo-01.component.html',
  styleUrls: ['./bg-color-demo-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class BgColorDemo01Component {
  install = `import { LyCommonModule } from '@alyle/ui';\n
@NgModule({
  imports: [
    ...
    LyCommonModule,
  ],
  exports: [...],
  declarations: [...]
})
export class MyModule { }`;
  @Input() color = 'accent';
  demo(attr: string, val: string, text?: string) {
    return (
      `<span ${attr}="${val}">${text}<span>`
    );
  }
}
