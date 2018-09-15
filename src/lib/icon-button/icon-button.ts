import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Optional,
  Renderer2,
  ChangeDetectionStrategy
} from '@angular/core';

import { LyRipple } from '@alyle/ui/ripple';
import { LyCommon, LyTheme2 } from '@alyle/ui';
import { LyIconButtonService } from './icon-button.service';

const STYLE_PRIORITY = -2;

const styles = theme => ({
  size: {
    width: theme.iconButton.size,
    height: theme.iconButton.size
  }
});

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[ly-icon-button], a[ly-icon-button], span[ly-icon-button]',
  template: `
  <div class="{{ iconButtonService.classes.content }}"
  lyRipple
  lyRippleCentered
  >
    <ng-content></ng-content>
  </div>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyIconButton'
})
export class LyIconButton implements OnInit {
  @ViewChild(LyRipple) ripple: LyRipple;
  classes = this.theme.addStyleSheet(styles, 'lyIconButton', STYLE_PRIORITY);
  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2,
    @Optional() bgAndColor: LyCommon,
    public iconButtonService: LyIconButtonService,
    private theme: LyTheme2
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, this.iconButtonService.classes.root);
    this.renderer.addClass(this.elementRef.nativeElement, this.classes.size);
  }
}

