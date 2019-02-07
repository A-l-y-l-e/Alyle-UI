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
  } from '@angular/core';
import { state, style, transition, animate, trigger, AnimationEvent } from '@angular/animations';
import { LyOverlayRef, LyTheme2, ThemeVariables, shadowBuilder } from '@alyle/ui';
import { Subject } from 'rxjs';

import { LyDialogRef } from './dialog-ref';
import { LyDialogConfig } from './dialog-config';

const STYLE_PRIORITY = -2;

/** @docs-private */
const STYLES = (theme: ThemeVariables) => ({
  root: {
    display: 'flex',
    position: 'relative',
    backgroundColor: theme.background.primary.default,
    borderRadius: '4px',
    boxShadow: shadowBuilder(12),
    overflow: 'auto',
    '> :first-child': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }
  }
});

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
  }
})
export class LyDialogContainer implements OnInit {
  /** @docs-private */
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _embeddedViewRef: EmbeddedViewRef<any>;
  private _componentRef: ComponentRef<any>;

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
  @ViewChild(TemplateRef, { read: ViewContainerRef }) private readonly viewContainerRef: ViewContainerRef;

  /** @internal */
  private _componentFactoryOrTemplate: ComponentFactory<any> | TemplateRef<any>;

  private _newInjector: Injector;

  constructor(
    private _appRef: ApplicationRef,
    private _overlayRef: LyOverlayRef,
    private _theme: LyTheme2,
    private _el: ElementRef<HTMLElement>,
    private _cd: ChangeDetectorRef,
    private _renderer: Renderer2
  ) {
    _renderer.addClass(_el.nativeElement, this.classes.root);
  }
  ngOnInit() {

    if (this._componentFactoryOrTemplate instanceof TemplateRef) {
      this._embeddedViewRef = this.viewContainerRef.createEmbeddedView(this._componentFactoryOrTemplate);
      this._appRef.attachView(this._embeddedViewRef);
    } else {
      this._componentRef = this.viewContainerRef.createComponent(this._componentFactoryOrTemplate, undefined, this._newInjector);
    }

    // If exist dialogStyleBlock apply for this component, else do nothing.
    const { containerClass } = this._newInjector.get(LyDialogConfig);
    if (containerClass) {
      this._renderer.addClass(this._el.nativeElement, containerClass);
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
}
