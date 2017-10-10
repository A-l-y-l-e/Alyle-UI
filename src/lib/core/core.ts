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
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyPalette, LyTheme, LyStyleTheme } from './palette';
import { ThemeModule } from './theme';
import { Platform } from './platform';

let id = 0;

@Component({
  selector: 'ly-core[root]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./core.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LyRoot {
  constructor(private elementRef: ElementRef, private theme: LyTheme) {
    this.elementRef.nativeElement.setAttribute('style', `
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-family: Roboto, "Helvetica Neue", sans-serif;
      overflow: auto;
    `);
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
export class LyCoreModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LyCoreModule,
    };
  }
}
