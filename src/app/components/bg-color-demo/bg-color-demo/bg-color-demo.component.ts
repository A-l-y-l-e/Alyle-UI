import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bg-color-demo',
  templateUrl: './bg-color-demo.component.html',
  styleUrls: ['./bg-color-demo.component.css']
})
export class BgColorDemoComponent implements OnInit {
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

  constructor() { }

  ngOnInit() {
  }

}
