import { Component } from '@angular/core';

@Component({
  selector: 'aui-installation',
  templateUrl: './installation.component.html'
})
export class InstallationComponent {
  code: string;
  constructor() {
    this.code = `...
/** Import animations */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Import Alyle UI */
import {
  LyThemeModule,
  LY_THEME
} from '@alyle/ui';

/** Import components */
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';

/** Import themes */
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

@NgModule({
  ...
  imports: [
    ...
    // Animations
    BrowserAnimationsModule,
    // Set theme
    LyThemeModule.setTheme('minima-light'),
    // Add components
    LyButtonModule,
    LyToolbarModule
    ...
  ],
  /** Add themes */
  providers: [
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: \`minima-light\`
    { provide: LY_THEME, useClass: MinimaDark, multi: true } // name: \`minima-dark\`
  ]
  ...
})
export class AppModule { }`;
  }

  toJson(val: any) {
    // /** Custom theme */
    // const configAlyleUI = ${this.toJson(this.palette)};
    val = JSON.stringify(val, undefined, 2);
    val = (<string>val).replace(/\s\s\"/g, '  ');
    return (<string>val).replace(/\"\:\s/g, ': ');
  }

}
