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
  ChangeDetectionStrategy,
  Optional,
  SkipSelf,
  Inject,
  Renderer2,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyTheme } from './theme.service';
import { ThemeModule } from './theme/theme.module';
import { Platform } from './platform/index';

const id = 0;

@Component({
  selector: 'ly-core[root]',
  template: `
  <ng-content></ng-content>
  `,
  styleUrls: ['./core.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LyRoot {
  themeSubscription: Subscription;
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    // private theme: LyTheme,
    @Inject(DOCUMENT) private document,
    @Optional() @SkipSelf() parent: LyRoot
  ) {
    if (parent) {
      throw new Error(
        'ly-core[root] is already loaded. Import it in the AppComponent only');
    }
    // this.rootService.rootContainer = this.renderer.createElement('ly-theme');
    // console.log('_____________.', this.document.body);
    // this.renderer.appendChild(this.document.body, this.rootService.rootContainer);
    // this.themeSubscription = this.theme.palette.subscribe((palette) => {
    //   console.warn('DEPRECATED: theme.palette');
    // });
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
  exports: [LyRoot, LyInlineText],
  declarations: [LyRoot, LyInlineText],
  providers: [Platform]
})
export class LyCoreModule { }
