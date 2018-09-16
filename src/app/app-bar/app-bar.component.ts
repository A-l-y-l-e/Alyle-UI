import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppComponent } from '../app.component';
import { LyTheme2, CoreTheme as ThemeManager, AUI_VERSION } from '@alyle/ui';
import { LyDrawer } from '@alyle/ui/drawer';

const styles = {
  header: {
    position: 'fixed',
    zIndex: 11,
    width: '100%'
  },
  themePickerText: {
    paddingLeft: '8px'
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
};

@Component({
  selector: 'aui-app-bar',
  templateUrl: './app-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppBarComponent implements OnInit {
  classes = this.theme.addStyleSheet(styles, 'aui-app-bar', 1);
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
