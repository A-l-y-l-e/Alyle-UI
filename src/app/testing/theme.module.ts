import { LyTheme2, LY_THEME, LY_THEME_NAME, StyleRenderer } from '@alyle/ui';
import { MinimaDark, MinimaLight } from '@alyle/ui/themes/minima';
import { NgModule } from '@angular/core';

@NgModule({
  providers: [
    [ LyTheme2 ],
    [ StyleRenderer ],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
  ]
})
export class AUIThemeModule { }
