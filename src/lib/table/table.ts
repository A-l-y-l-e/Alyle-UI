import {
  // CDK_TABLE_TEMPLATE,
  CdkTable,
  CDK_TABLE,
  // _CoalescedStyleScheduler,
  // _COALESCED_STYLE_SCHEDULER,
  STICKY_POSITIONING_LISTENER,
  RenderRow,
  RowContext,
  StickyPositioningListener,
} from '@angular/cdk/table';
import {
  Attribute,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  Inject,
  Input,
  IterableDiffers,
  NgZone,
  Optional,
  SkipSelf,
  ViewEncapsulation,
  DOCUMENT
} from '@angular/core';
import {
  _DisposeViewRepeaterStrategy,
  _RecycleViewRepeaterStrategy,
  _ViewRepeater,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections';
import { StyleRenderer } from '@alyle/ui';

import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { STYLES as TABLE_STYLES } from './styles';



/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
@Directive({
  selector: 'ly-table[recycleRows], table[ly-table][recycleRows]',
  providers: [{provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy}],
  standalone: false
})
export class LyRecycleRows {}

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Component({
  selector: 'ly-table, table[ly-table]',
  exportAs: 'lyTable',
  template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content/>
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `,
  providers: [
    StyleRenderer,
    {provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy},
    {provide: CdkTable, useExisting: LyTable},
    {provide: CDK_TABLE, useExisting: LyTable},
    // Prevent nested tables from seeing this table's StickyPositioningListener.
    {provide: STICKY_POSITIONING_LISTENER, useValue: null},
  ],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false
})
export class LyTable<T> extends CdkTable<T> {
  readonly classes = this.sRenderer.renderSheet(TABLE_STYLES, 'root');

  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected override stickyCssClass = this.classes.sticky;

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  protected override needsPositionStickyOnElement = false;

  /**
   * Whether to use a fixed table layout. Enabling this option will enforce consistent column widths
   * and optimize rendering sticky styles for native tables. No-op for flex tables.
   */
  @Input({transform: booleanAttribute})
  override get fixedLayout(): boolean {
    return super.fixedLayout;
  }
  override set fixedLayout(v: boolean) {
    super.fixedLayout = v;
    const newVal = super.fixedLayout;
    this.sRenderer.toggleClass(this.classes.fixedLayout, newVal);
  }

  constructor(
    _differs: IterableDiffers,
    _changeDetectorRef: ChangeDetectorRef,
    _elementRef: ElementRef,
    @Attribute('role') role: string,
    @Optional() _dir: Directionality,
    @Inject(DOCUMENT) _document: any,
    _platform: Platform,
    @Inject(_VIEW_REPEATER_STRATEGY)
    _viewRepeater: _ViewRepeater<T, RenderRow<T>, RowContext<T>>,
    _viewportRuler: ViewportRuler,
    @Optional()
    @SkipSelf()
    @Inject(STICKY_POSITIONING_LISTENER)
    _stickyPositioningListener: StickyPositioningListener,
    @Optional()
    _ngZone: NgZone,
    readonly sRenderer: StyleRenderer
  ) {
    super(
      _differs,
      _changeDetectorRef,
      _elementRef,
      role,
      _dir,
      _document,
      _platform,
      _viewRepeater,
      _viewportRuler,
      _stickyPositioningListener,
      _ngZone
    );
  }

}
