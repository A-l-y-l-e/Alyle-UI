import {
  Component,
  Directive,
  ElementRef,
  NgModule,
  ModuleWithProviders,
  Input,
  OnInit,
  OnDestroy,
  HostBinding,
  HostListener }        from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {
  LyTheme,
  themeProperty,
  BgAndColorStyle,
  LyStyleTheme }        from 'alyle-ui/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: 'ly-toolbar-item',
})
export class ToolbarItem {}

@Component({
  selector: 'ly-toolbar',
  template: '<ng-content></ng-content>',
  styleUrls: ['toolbar.css', 'toolbar-item.css'],
})
export class LyToolbar implements OnInit, OnDestroy {
  private _bg = 'primary';
  private _color = 'main';
  private _subscription: Subscription;
  @HostBinding('style.background') styleBackground: string;
  @HostBinding('style.color') styleColor: string;

  constructor(
    private elementRef: ElementRef,
    public theme: LyTheme,
    public styleTheme: LyStyleTheme,
  ) {
  }

  @Input()
  set toolbarBg(val: string) {
    this._bg = val;
    this.styleBackground = this.theme.color(this._bg);
  }

  @Input()
  set toolbarColor(val: string) {
    this._color = val;
    this.styleColor = this.theme.color(this._color);
  }

  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this.styleBackground = this.theme.color(this._bg, colors);
      this.styleColor = this.theme.color(this._color, colors);
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
@NgModule({
  imports: [CommonModule],
  exports: [LyToolbar, ToolbarItem],
  declarations: [LyToolbar, ToolbarItem],
  providers: [LyStyleTheme]
})
export class LyToolbarModule {
}
