import {
  Component,
  ModuleWithProviders,
  NgModule,
  ViewEncapsulation,
  ElementRef,
  OnDestroy,
  Directive,
  Input,
  HostBinding,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyPalette, LyTheme, LyStyleTheme } from './palette';
import { ThemeModule } from './theme/theme.module';
import { Platform } from './platform/index';

const id = 0;

@Component({
  selector: 'ly-core[root]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./core.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LyRoot implements OnDestroy {
  @HostBinding('style.background') backgroundStyle: string;
  @HostBinding('style.color') colorStyle: string;
  @HostBinding('style.font-family') fontFamily: string;
  themeSubscription: Subscription;
  constructor(private elementRef: ElementRef, private theme: LyTheme) {
    this.themeSubscription = this.theme.palette.subscribe((palette) => {
      this.backgroundStyle = palette['bgText'];
      this.colorStyle = palette['colorText'];
      this.fontFamily = theme.AlyleUI.currentTheme.typography.fontFamily;
    });
  }
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
@Component({
  selector: 'inline-text',
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      vertical-align: baseline;
    }
  `],
})
export class LyInlineText {}

@NgModule({
  imports: [CommonModule],
  exports: [LyRoot, LyInlineText, ThemeModule],
  declarations: [LyRoot, LyInlineText],
  providers: [Platform]
})
export class LyCoreModule {}
