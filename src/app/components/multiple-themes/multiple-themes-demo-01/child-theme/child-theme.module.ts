import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildThemeRoutingModule } from './child-theme-routing.module';
import { ChildThemeComponent } from './child-theme.component';
import { AlyleUIModule } from 'alyle-ui';
import { ThemeModule } from 'alyle-ui/core';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    AlyleUIModule.forChild({
      name: 'RootTheme', // Select root theme or you can create a new one
      scheme: 'myCustomScheme' // Use this only to change the scheme, this is equal ligth + myCustomScheme
      /** NOTE:
       * Only if the name of the theme is already created
       * Please do not set other variables, if you do the theme will be replaced
       * only in the new styles or when you change the scheme
       * And that's not good
       */
    }),
    ChildThemeRoutingModule
  ],
  declarations: [ChildThemeComponent]
})
export class ChildThemeModule { }
