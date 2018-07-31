import { NgModule } from '@angular/core';
import { ThemingComponent } from './customization/theming/theming.component';
import { PrismModule } from '../core/prism/prism.module';
import { DemoViewModule } from '../demo-view';
import { LyTypographyModule } from '@alyle/ui/typography';

@NgModule({
  imports: [
    LyTypographyModule,
    PrismModule,
    DemoViewModule
  ],
  declarations: [
    ThemingComponent
  ],
  exports: [
    ThemingComponent
  ]
})
export class DocsModule { }
