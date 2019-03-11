import { Component, Input, ChangeDetectionStrategy, Inject, ElementRef, Renderer2, ContentChild, ChangeDetectorRef } from '@angular/core';
import { toBoolean } from '@alyle/ui';
import { LyAccordion } from './accordion';
import { LyExpansionPanelContent } from './expansion-panel-content';
import { lyExpansionAnimations } from './expansion-animations';
import { LyTheme2 } from 'lib/src/theme/theme2.service';

/** LyExpansionPanel's states. */
export type LyExpansionPanelState = 'expanded' | 'collapsed';

@Component({
  selector: 'ly-expansion-panel',
  templateUrl: './expansion-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyExpansionPanel',
  animations: [
    lyExpansionAnimations.contentExpansion
  ]
})
export class LyExpansionPanel {

  readonly classes = this._accordion.classes;

  readonly _panelAnimationTiming = `${
    this._theme.variables.animations.durations.entering
  }ms ${
    this._theme.variables.animations.curves.standard
  }`;

  private _disabled: boolean;
  private _expanded: boolean;
  private _hasToggle: boolean;

  /** Content that will be rendered lazily. */
  @ContentChild(LyExpansionPanelContent) readonly _lazyContent: LyExpansionPanelContent;

  @Input()
  set disabled(val: boolean | '') {
    const newVal = toBoolean(val);

    if (newVal !== this.disabled) {
      this._disabled = newVal;
      if (newVal) {
        this._renderer.addClass(this._el.nativeElement, this._accordion.classes.disabled);
      } else {
        this._renderer.removeClass(this._el.nativeElement, this._accordion.classes.disabled);
      }
    }
  }
  get disabled() {
    return this._disabled;
  }

  @Input()
  set expanded(val: boolean | '') {
    const newVal = toBoolean(val);

    if (newVal !== this.expanded && !this.disabled) {
      this._expanded = newVal;
      if (newVal) {
        this._renderer.addClass(this._el.nativeElement, this._accordion.classes.expanded);
      } else {
        this._renderer.removeClass(this._el.nativeElement, this._accordion.classes.expanded);
      }
      this._cd.markForCheck();
    }
  }
  get expanded() {
    return this._expanded;
  }

  @Input()
  set hasToggle(val: boolean | '') {
    this._hasToggle = toBoolean(val);
  }
  get hasToggle() {
    return this._hasToggle;
  }

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _cd: ChangeDetectorRef,
    private _theme: LyTheme2,
    @Inject(LyAccordion) private _accordion: LyAccordion
  ) {
    _renderer.addClass(_el.nativeElement, this._accordion.classes.panel);
  }

  close() {
    this.expanded = false;
  }

  open() {
    this.expanded = true;
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  /** Gets the expanded state string. */
  _getExpandedState(): LyExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }

}
