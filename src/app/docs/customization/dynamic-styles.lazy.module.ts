import { NgModule, Type } from '@angular/core';
import { LyTypographyModule } from '@alyle/ui/typography';

import { DsBasicModule } from './dynamic-styles/ds-basic/ds-basic.module';
import { DsBasicComponent } from './dynamic-styles/ds-basic/ds-basic.component';
import { DsCssDeclarationsBlockComponent } from './dynamic-styles/ds-css-declarations-block/ds-css-declarations-block.component';
import { DsCssDeclarationsBlockModule } from './dynamic-styles/ds-css-declarations-block/ds-css-declarations-block.module';
import { DsNestingModule } from './dynamic-styles/ds-nesting/ds-nesting.module';
import { DsNestingComponent } from './dynamic-styles/ds-nesting/ds-nesting.component';
import { DsReusableStylesModule } from './dynamic-styles/ds-reusable-styles/ds-reusable-styles.module';
import { DsReusableStylesComponent } from './dynamic-styles/ds-reusable-styles/ds-reusable-styles.component';

const elements = [
  DsBasicComponent,
  DsCssDeclarationsBlockComponent,
  DsNestingComponent,
  DsReusableStylesComponent
];

@NgModule({
  imports: [
    LyTypographyModule,
    DsBasicModule,
    DsCssDeclarationsBlockModule,
    DsNestingModule,
    DsReusableStylesModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
