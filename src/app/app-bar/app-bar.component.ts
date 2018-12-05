import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { AppComponent } from '../app.component';
import { LyTheme2, CoreTheme as ThemeManager, AUI_VERSION } from '@alyle/ui';
import { LyDrawer } from '@alyle/ui/drawer';

const styles = () => ({
  themePickerText: {
    paddingBefore: '8px'
  },
  logo: {
    height: '64px',
    borderRadius: 0,
    fontSize: '20px'
  },
  version: {
    fontSize: '71%',
    opacity: .71
  }
});

@Component({
  selector: 'aui-app-bar',
  templateUrl: './app-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppBarComponent implements OnInit {
  classes = this.theme.addStyleSheet(styles, 1);
  version = AUI_VERSION;
  themes: Set<string>;
  drawer: LyDrawer;
  constructor(
    private appComponent: AppComponent,
    public theme: LyTheme2,
    public themeManager: ThemeManager
  ) {
    this.themes = themeManager.themes;
  }

  ngOnInit() {
    this.drawer = this.appComponent.drawer;
  }

}
