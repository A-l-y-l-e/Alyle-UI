import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  Renderer2,
  OnChanges,
  OnInit,
  OnDestroy,
  TemplateRef,
  Output,
  EventEmitter,
  AfterContentInit
  } from '@angular/core';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinElevation,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  toBoolean
  } from '@alyle/ui';

import { LyAccordion } from './accordion';
import { lyExpansionAnimations } from './expansion-animations';
import { LyExpansionPanelContent } from './expansion-panel-content';
import { Subscription, Subject } from 'rxjs';
import { startWith, filter, first, distinctUntilChanged } from 'rxjs/operators';
import { AnimationEvent } from '@angular/animations';

/** LyExpansionPanel's states. */
export type LyExpansionPanelState = 'expanded' | 'collapsed';

/** @docs-private */
export class LyExpansionPanelBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyButtonMixinBase = mixinStyleUpdater(
  mixinBg(
    mixinColor(
      mixinRaised(
        mixinElevation(
          mixinShadowColor(LyExpansionPanelBase))))));

@Component({
  selector: 'ly-expansion-panel',
  templateUrl: './expansion-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyExpansionPanel',
  animations: [
    lyExpansionAnimations.contentExpansion
  ],
  inputs: [
    'bg',
    'color',
    'raised',
    'elevation',
    'shadowColor'
  ]
})
export class LyExpansionPanel extends LyButtonMixinBase implements OnChanges, OnInit, AfterContentInit, OnDestroy {

  /** @docs-private */
  readonly classes = this._accordion.classes;

  readonly _panelAnimationTiming = `${
    this._theme.variables.animations.durations.entering
  }ms ${
    this._theme.variables.animations.curves.standard
  }`;

  /** Subscription to openAll/closeAll events. */
  private _openCloseAllSubscription = Subscription.EMPTY;

  private _disabled: boolean;
  private _expanded: boolean;
  private _hasToggle = !!this._accordion.hasToggle;

  _lazyContentRef: TemplateRef<any>;

  /** Content that will be rendered lazily. */
  @ContentChild(LyExpansionPanelContent) readonly _lazyContent: LyExpansionPanelContent;

  /** Event emitted every time the LyExpansionPanel is closed. */
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted every time the LyExpansionPanel is opened. */
  @Output() opened: EventEmitter<void> = new EventEmitter<void>();

  /** An event emitted after the body's collapse animation happens. */
  @Output() afterCollapse: EventEmitter<void> = new EventEmitter<void>();

  /** An event emitted after the body's expansion animation happens. */
  @Output() afterExpand: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted when the LyExpansionPanel is destroyed. */
  @Output() destroyed: EventEmitter<void> = new EventEmitter<void>();

  /** Stream of body animation done events. */
  _bodyAnimationDone = new Subject<AnimationEvent>();

  @Input()
  set disabled(val: boolean) {
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
  set expanded(val: boolean) {
    const newVal = toBoolean(val);

    if (newVal !== this.expanded && !this.disabled) {

      // unselect other panels
      if (newVal && !this._accordion.multiple) {
        this._accordion._openCloseAllActions.next(false);
      }
      this._expanded = newVal;
      if (newVal) {
        this._renderer.addClass(this._el.nativeElement, this._accordion.classes.expanded);
        this.opened.emit();
      } else {
        this._renderer.removeClass(this._el.nativeElement, this._accordion.classes.expanded);
        this.closed.emit();
      }
      this._cd.markForCheck();
    }
  }
  get expanded() {
    return this._expanded;
  }

  @Input()
  set hasToggle(val: boolean) {
    this._hasToggle = toBoolean(val);
  }
  get hasToggle() {
    return this._hasToggle == null ? this._accordion.hasToggle : this._hasToggle;
  }

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _cd: ChangeDetectorRef,
    _theme: LyTheme2,
    @Inject(LyAccordion) private _accordion: LyAccordion
  ) {
    super(_theme);
    _renderer.addClass(_el.nativeElement, this._accordion.classes.panel);
    this._openCloseAllSubscription = this._subscribeToOpenCloseAllActions();

    this._bodyAnimationDone.pipe(distinctUntilChanged((x, y) => {
      return x.fromState === y.fromState && x.toState === y.toState;
    })).subscribe(event => {
      if (event.fromState !== 'void') {
        if (event.toState === 'expanded') {
          this.afterExpand.emit();
        } else if (event.toState === 'collapsed') {
          this.afterCollapse.emit();
        }
      }
    });
  }

  ngOnChanges() {
    this.updateStyle(this._el);
  }

  ngOnInit() {

    let requireUpdate: boolean = false;

    if (this.bg == null) {
      this.bg = this._accordion.panelBg;
      requireUpdate = true;
    }
    if (this.color == null) {
      this.color = this._accordion.panelColor;
      requireUpdate = true;
    }
    if (this.elevation == null) {
      this.elevation = 2;
      requireUpdate = true;
    }

    if (requireUpdate) {
      this.ngOnChanges();
    }
  }

  ngAfterContentInit() {
    if (this._lazyContent) {
      this.opened.pipe(
        startWith<void>(null!),
        filter(() => !!this.expanded && !this._lazyContentRef),
        first()
      ).subscribe(() => this._lazyContentRef = this._lazyContent._template);
    }
  }

  ngOnDestroy() {
    this._openCloseAllSubscription.unsubscribe();
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

  private _subscribeToOpenCloseAllActions(): Subscription {
    return this._accordion._openCloseAllActions.subscribe(expanded => {
      this.expanded = expanded;
    });
  }

}
