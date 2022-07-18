import {
  OnInit,
  Component,
  ComponentFactory,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  Injector,
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  ChangeDetectionStrategy,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  AfterContentInit,
  } from '@angular/core';
import { state, style, transition, animate, trigger, AnimationEvent } from '@angular/animations';
import {
  LyOverlayRef,
  LyTheme2,
  ThemeVariables,
  shadowBuilder,
  lyl,
  LyClasses,
  StyleCollection,
  StyleTemplate,
  ThemeRef,
  StyleRenderer,
  WithStyles } from '@alyle/ui';
import { Subject } from 'rxjs';

import { LyDialogRef } from './dialog-ref';
import { LyDialogConfig } from './dialog-config';
import { LY_DIALOG_DATA } from './dialog-data';
import { Color } from '@alyle/ui/color';
import {
  FocusTrapFactory,
  FocusTrap,
} from '@angular/cdk/a11y';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';

const STYLE_PRIORITY = -2;

export interface LyDialogTheme {
  /** Styles for Dialog Component. */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
  | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
  /** Styles that apply when a color is set. */
  color?: (classes: LyClasses<typeof STYLES>, color: Color) => StyleTemplate;
}

export interface LyDialogVariables {
  dialog?: LyDialogTheme;
}

/** @docs-private */
const STYLES = (theme: ThemeVariables & LyDialogVariables, ref: ThemeRef) => {
  const dialog = ref.selectorsOf(STYLES);
  return {
    root: ( ) => lyl `{
      display: flex
      position: relative
      background-color: ${theme.background.primary.default}
      border-radius: 4px
      box-shadow: ${shadowBuilder(12)}
      overflow: auto
      pointer-events: auto
      > :first-child {
        display: flex
        flex-direction: column
        width: 100%
      }
      {
        ...${
          (theme.dialog
            && theme.dialog.root
            && (theme.dialog.root instanceof StyleCollection
              ? theme.dialog.root.setTransformer(fn => fn(dialog))
              : theme.dialog.root(dialog))
          )
        }
      }
    }`
  };
};

/** @docs-private */
@Component({
  selector: 'ly-dialog-container',
  template: '<ng-template></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dialogContainer', [
      state('void, exit', style({opacity: 0, transform: 'scale(0.7)'})),
      state('enter', style({transform: 'none'})),
      transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)',
        style({transform: 'none', opacity: 1}))),
      transition('* => void, * => exit',
        animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({opacity: 0})))
    ])
  ],
  host: {
    '[@dialogContainer]': '_state',
    '(@dialogContainer.start)': '_onAnimationStart($event)',
    '(@dialogContainer.done)': '_onAnimationDone($event)'
  },
  providers: [
    StyleRenderer
  ]
})
export class LyDialogContainer implements WithStyles, OnInit, AfterContentInit, OnDestroy {
  /** @docs-private */
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _embeddedViewRef: EmbeddedViewRef<any>;
  private _componentRef: ComponentRef<any>;
  private _focusTrap: FocusTrap;

  /** Previously focused element to restore focus to upon destroy when using autoCapture. */
  private _previouslyFocusedElement: HTMLElement | null = null;

  /** @internal */
  readonly _afterOpened = new Subject<void>();
  /** @internal */
  readonly _beforeClosed = new Subject<any>();
  /** @internal */
  readonly _afterClosed = new Subject<any>();

  /**
   * State of the dialog animation.
   * @internal
   */
  _state: 'void' | 'enter' | 'exit' = 'enter';

  /** @internal */
  @ViewChild(TemplateRef, { read: ViewContainerRef, static: true }) private readonly viewContainerRef: ViewContainerRef;

  /** @internal */
  private _componentFactoryOrTemplate: ComponentFactory<any> | TemplateRef<any>;

  private _newInjector: Injector;

  constructor(
    readonly sRenderer: StyleRenderer,
    private _appRef: ApplicationRef,
    private _overlayRef: LyOverlayRef,
    private _theme: LyTheme2,
    private _el: ElementRef<HTMLElement>,
    private _cd: ChangeDetectorRef,
    private _renderer: Renderer2,
    private _trapFactory: FocusTrapFactory
  ) {
    _renderer.addClass(_el.nativeElement, this.classes.root);
  }
  ngOnInit() {

    if (this._componentFactoryOrTemplate instanceof TemplateRef) {

      const context = new LyDialogContext(this._newInjector);

      this._embeddedViewRef = this.viewContainerRef
      .createEmbeddedView(this._componentFactoryOrTemplate, context);
    } else {
      this._componentRef = this.viewContainerRef
          .createComponent(this._componentFactoryOrTemplate, undefined, this._newInjector);
    }

    // If exist dialogStyleBlock apply for this component, else do nothing.
    const { containerClass } = this._newInjector.get(LyDialogConfig);
    if (containerClass) {
      this._renderer.addClass(this._el.nativeElement, containerClass);
    }
  }

  ngAfterContentInit() {
    this._focusTrap = this._trapFactory.create(this._el.nativeElement);
    this._captureFocus();
  }

  ngOnDestroy(): void {
    this._focusTrap.destroy();
    if (this._previouslyFocusedElement) {
      this._previouslyFocusedElement.focus();
      this._previouslyFocusedElement = null;
    }
  }

  /** @internal */
  _init(componentFactoryOrTemplate: ComponentFactory<any> | TemplateRef<any>, newInjector: Injector) {
    this._componentFactoryOrTemplate = componentFactoryOrTemplate;
    this._newInjector = newInjector;
  }

  /**
   * Start to close, starts the dialog exit animation.
   * @internal
   */
  _startClose() {
    this._state = 'exit';
    this._cd.markForCheck();
  }

  _onAnimationStart(event: AnimationEvent) {
    if (event.toState === 'enter') {
      this._overlayRef!.onResizeScroll!();
    }
  }

  /** @internal */
  _onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'exit') {
      const dialogRef = this._newInjector.get(LyDialogRef);
      this._destroy();
      this._overlayRef.destroy();
      this._afterClosed.next(dialogRef.result);
      this._afterClosed.complete();
    } else if (event.toState === 'enter') {
      this._afterOpened.next();
      this._afterOpened.complete();
    }
  }

  private _destroy() {
    if (this._componentRef) {
      this._appRef.detachView(this._componentRef.hostView);
      this._componentRef.destroy();
    } else {
      this._appRef.detachView(this._embeddedViewRef);
      this._embeddedViewRef.detach();
      this._embeddedViewRef.destroy();
    }
  }

  /** @internal */
  _getHostElement() {
    return this._el.nativeElement;
  }

  private _captureFocus() {
    this._previouslyFocusedElement = _getFocusedElementPierceShadowDom();
    this._focusTrap.focusInitialElementWhenReady();
  }
}

export class LyDialogContext {
  $implicit: any = this._injector.get(LyDialogRef);
  dialogRef = this._injector.get(LyDialogRef);

  get data() {
    return this._injector.get(LY_DIALOG_DATA);
  }

  constructor(private _injector: Injector) { }
}
