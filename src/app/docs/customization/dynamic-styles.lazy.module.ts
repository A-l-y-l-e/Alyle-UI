import { NgModule, Type } from '@angular/core';
import { LyTypographyModule } from '@alyle/ui/typography';

import { WithThemeVariablesModule } from './dynamic-styles/with-theme-variables/with-theme-variables.module';
import { WithThemeVariablesComponent } from './dynamic-styles/with-theme-variables/with-theme-variables.component';
import { DsCssDeclarationsBlockComponent } from './dynamic-styles/ds-css-declarations-block/ds-css-declarations-block.component';
import { DsCssDeclarationsBlockModule } from './dynamic-styles/ds-css-declarations-block/ds-css-declarations-block.module';
import { DsNestingModule } from './dynamic-styles/ds-nesting/ds-nesting.module';
import { DsNestingComponent } from './dynamic-styles/ds-nesting/ds-nesting.component';
import { DsReusableStylesModule } from './dynamic-styles/ds-reusable-styles/ds-reusable-styles.module';
import { DsReusableStylesComponent } from './dynamic-styles/ds-reusable-styles/ds-reusable-styles.component';

const elements = [
  WithThemeVariablesComponent,
  DsCssDeclarationsBlockComponent,
  DsNestingComponent,
  DsReusableStylesComponent
];

@NgModule({
  imports: [
    LyTypographyModule,
    WithThemeVariablesModule,
    DsCssDeclarationsBlockModule,
    DsNestingModule,
    DsReusableStylesModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
