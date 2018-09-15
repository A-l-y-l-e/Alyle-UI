import {
  Directive,
  Optional,
  Renderer2,
  ElementRef
} from '@angular/core';
import { LyCommon, LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = -2;

const styles = ({
  root: {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'row',
    alignItems: 'center',
    height: '64px',
    width: '100%'
  },
  row: {
    padding: '0 16px',
    display: 'flex',
    boxSizing: 'border-box',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  }
});

@Directive({
  selector: 'ly-toolbar-item'
})
export class ToolbarItem {
  constructor() {
    console.warn('ly-toolbar-item @deprecated');
  }
}

@Directive({
  selector: 'ly-toolbar'
})
export class LyToolbar {
  classes = this.theme.addStyleSheet(styles, 'ly-toolbar', STYLE_PRIORITY);

  constructor(
    renderer: Renderer2,
    el: ElementRef,
    private theme: LyTheme2,
    @Optional() bgAndColor: LyCommon
  ) {
    renderer.addClass(el.nativeElement, this.classes.row);
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
  }
}


@Directive({
  selector: 'ly-toolbar-row'
})
export class LyToolbarRow {
  constructor(
    el: ElementRef,
    renderer2: Renderer2,
    @Optional() toolbar: LyToolbar
  ) {
    renderer2.addClass(el.nativeElement, toolbar.classes.row);
    /** TODO: fix this */
  }
}
