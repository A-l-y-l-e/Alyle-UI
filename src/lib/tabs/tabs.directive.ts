import {
  Component,
  Directive,
  Input,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  Output,
  TemplateRef,
  ContentChild,
  ViewChild,
  HostListener,
  forwardRef,
  EventEmitter,
  ChangeDetectorRef,
  Renderer2,
  ElementRef,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { LyTabContent } from './tab-content.directive';
import { LyTabsClassesService } from './tabs.clasess.service';
import { UndefinedValue, Undefined } from '@alyle/ui';

@Component({
  selector: 'ly-tabs',
  templateUrl: './tabs.directive.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Native,
  exportAs: 'lyTabs'
})
export class LyTabs implements OnInit {
  _selectedIndex: number | Undefined = UndefinedValue;
  _selectedRequireCheck: boolean;
  _selectedEl: HTMLElement;
  @ViewChild('tabContents') tabContents: ElementRef;
  @Input()
  set selectedIndex(val: number) {
    if (val !== this.selectedIndex) {
      this._selectedIndex = val;
      this.selectedIndexChange.emit(val);
      console.log('set index:', val, this.tabContents);
      if (this._selectedRequireCheck) {
        this.markForCheck();
        console.log('·······markForCheck()');
      }
      this.renderer.setStyle(this.tabContents.nativeElement, 'transform', `translate3d(${val * -100}%,0,0)`);
    }
  }
  get selectedIndex() {
    return this._selectedIndex as number;
  }
  @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter();
  @Input() withColor: string;
  @Input() withBg: string;
  @ContentChildren(forwardRef(() => LyTab)) tabsList: QueryList<LyTab>;

  constructor(
    public classes: LyTabsClassesService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.classes.tabs);
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  loadTemplate(tab: LyTab, index: number): TemplateRef<LyTabContent> | null {
    if (tab.loaded) {
      return null;
    }
    tab.index = index;
    console.log('tab', this.selectedIndex, 'index', index);
    if (this.selectedIndex === UndefinedValue) {
      console.warn('isUndefinedValue');
      this.selectedIndex = 0;
    }
    if (tab.templateRefLazy) {
      if (this.selectedIndex === index) {
        tab.loaded = true;
        return tab.templateRefLazy;
      } else {
        return null;
      }
    } else {
      tab.loaded = true;
      return tab.templateRef;
    }
  }
}

@Component({
  selector: 'ly-tab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Native
})
export class LyTab implements OnInit {
  index: number;
  loaded: boolean;
  @ContentChild(LyTabContent, { read: TemplateRef }) templateRefLazy: TemplateRef<LyTabContent>;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @HostListener('click') onClick() {
    console.log('click', this.index, this.tabs.selectedIndex);
    this.tabs._selectedRequireCheck = !this.loaded;
    this.tabs.selectedIndex = this.index;
  }

  constructor(
    private tabs: LyTabs,
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.tabs.classes.tab);
  }
}

@Directive({
  selector: 'ly-tab-label, [ly-tab-label]'
})
export class LyTabLabel implements OnInit {
  @Input() native: boolean;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private classes: LyTabsClassesService
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.classes.tabLabel);
  }
}
/**
 * demo basic
 * <ly-tabs withColor="accent">
 *   <ly-tab>
 *     <ly-tab-label>HOME<ly-tab-label>
 *     <button ly-tab-label>HOME<button>
 *     <button ly-tab-label native ly-button>HOME<button>
 *     <a [routerLink]="['home']" ly-tab-label native ly-button>HOME<a>
 *     Content
 *   </ly-tab>
 *   ...
 * </ly-tabs>
 *
 * demo lazy loading
 * <ly-tabs withBg="primary">
 *   <ly-tab>
 *     <ly-tab-label>HOME<ly-tab-label>
 *     <ng-template ly-tab-content></ng-template>
 *   </ly-tab>
 *   ...
 * </ly-tabs>
 * => withColor: color del label activa, default primary
 * => withBg: color de fondo para la tab, default background:primary
 * => native: no aplica los estilos predeterminados, default undefined
 * => disabled: Disable/enable a tab, default undefined
 * => isActive: Si la pestaña está actualmente activa., default undefined
 */

/**
* Hasta ahora todo bien
* agregar esstilo para el tab activo
* crear markForCheck en LyTab
* cuando el se establece selectedIndex, deveria de agregar la classe activo y if existe anterior seleccionado eliminar ese
*/
