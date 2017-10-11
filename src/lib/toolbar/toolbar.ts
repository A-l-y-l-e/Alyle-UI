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
export class LyToolbar implements OnInit, OnDestroy, BgAndColorStyle {
  private _bg = 'primary';
  private _color = 'rgba(0, 0, 0, 0.60)';
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
  set bg(val: string) {
    this._bg = val;
    this.styleBackground = this.theme.color(this._bg);
  }

  @Input()
  set color(val: string) {
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
  // theme.color(type: 'bg' | 'color', color: string, colors?: any): void {
  //   switch (type) {
  //     case 'color':
  //     if (colors) {
  //       this.styleColor = getColor(colors, color);
  //     } else {
  //       this.styleColor = getColor(this.theme.AlyleUI.palette, color);
  //     }
  //       break;
  //     case 'bg':
  //     if (colors) {
  //       this.styleBackground = getColor(colors, color);
  //     } else {
  //       this.styleBackground = getColor(this.theme.AlyleUI.palette, color);
  //     }
  //       break;
  //   }
  // }
}
@NgModule({
  imports: [CommonModule],
  exports: [LyToolbar, ToolbarItem],
  declarations: [LyToolbar, ToolbarItem],
  providers: [LyStyleTheme]
})
export class LyToolbarModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LyToolbarModule,
    };
  }
}
