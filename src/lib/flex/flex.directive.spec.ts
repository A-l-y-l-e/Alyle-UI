import { inject, async, fakeAsync, tick, TestBed } from '@angular/core/testing';
import { LyFlexModule, LyFlex } from './index';
import { Renderer2, ElementRef, Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { LY_THEME_CONFIG } from '@alyle/ui';
import { MinimaTheme } from '@alyle/ui/themes/minima';
import { By } from '@angular/platform-browser';
import { LY_MEDIA_QUERIES, Breakpoints } from '@alyle/ui/responsive';

describe('LyFlex', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LyFlexModule],
      declarations: [
        FlexAlign,
        FlexFlow,
        FlexDisplay,
        FlexDirection,
        FlexWrap,
        FlexAlignDefault
      ],
      providers: [{ provide: LY_THEME_CONFIG, useClass: MinimaTheme }, { provide: LY_MEDIA_QUERIES, useValue: Breakpoints }],
    });

    TestBed.compileComponents();
  }));

  it('should add class based on `fxAlign` attribute', () => {
    const fixture = TestBed.createComponent(FlexAlign);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const element1 = fixture.debugElement.query(By.css('[a]')).nativeElement;
    const element2 = fixture.debugElement.query(By.css('[b]')).nativeElement;
    const computedStyleEl1 = getComputedStyle(element1);
    const computedStyleEl2 = getComputedStyle(element2);
    expect(element1.className.split(' ').length).toEqual(2);
    expect(testComponent.items.first.fxAlign).toEqual([ 'center', 'center' ]);
    expect(computedStyleEl1.justifyContent).toEqual('center');
    expect(computedStyleEl1.display).toEqual('flex');
    expect(computedStyleEl1.alignItems).toEqual('center');
    expect(computedStyleEl1.alignContent).toEqual('center');
    expect(element2.className.split(' ').length).toEqual(2);
    expect(testComponent.items.last.fxAlign).toEqual('center center');
    expect(computedStyleEl2.justifyContent).toEqual('center');
    expect(computedStyleEl2.display).toEqual('flex');
    expect(computedStyleEl2.alignItems).toEqual('center');
    expect(computedStyleEl2.alignContent).toEqual('center');

    testComponent.items.last.fxAlign = 'center center';
    expect(testComponent.items.last.fxAlign).toEqual('center center');
  });

  it('should set default `start stretch stretch` on fxAlign', () => {
    const fixture = TestBed.createComponent(FlexAlignDefault);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    expect(testComponent.fx.fxAlign).toEqual(`start stretch stretch`);
  });

  it('should set default `row wrap` on `fxFlow`', () => {
    const fixture = TestBed.createComponent(FlexFlow);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const element = fixture.debugElement.query(By.css('div')).nativeElement;
    const computedStyle = getComputedStyle(element);
    expect(computedStyle.flexFlow).toEqual('row wrap');
    expect(testComponent.fx.fxFlow).toEqual('row wrap');
    testComponent.fx.fxFlow = 'row wrap';
    testComponent.fx.fxFlow = 'row nowrap';
    expect(testComponent.fx.fxFlow).toEqual('row nowrap');
    testComponent.fx.fxFlow = ['row', 'nowrap'];
    expect(testComponent.fx.fxFlow).toEqual(['row', 'nowrap']);

  });

  it('should set `inline-flex` on `fxDisplay="inline"`', () => {
    const fixture = TestBed.createComponent(FlexDisplay);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const element = fixture.debugElement.query(By.css('div')).nativeElement;
    const computedStyle = getComputedStyle(element);
    expect(computedStyle.display).toEqual('inline-flex');
    expect(testComponent.fx.fxDisplay).toEqual('inline');
    testComponent.fx.fxDisplay = 'inline';
    expect(testComponent.fx.fxDisplay).toEqual('inline');
  });

  it('should set default `row` on `fxDirection`', () => {
    const fixture = TestBed.createComponent(FlexDirection);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const element = fixture.debugElement.query(By.css('div')).nativeElement;
    const computedStyle = getComputedStyle(element);
    expect(computedStyle.flexDirection).toEqual('row');
    expect(testComponent.fx.fxDirection).toEqual('row');
    testComponent.fx.fxDirection = 'row';
    testComponent.fx.fxDirection = 'column';
    expect(computedStyle.flexDirection).toEqual('column');
    expect(testComponent.fx.fxDirection).toEqual('column');
  });

  it('should set default `wrap` on `fxWrap`', () => {
    const fixture = TestBed.createComponent(FlexWrap);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const element = fixture.debugElement.query(By.css('div')).nativeElement;
    const computedStyle = getComputedStyle(element);
    expect(computedStyle.flexWrap).toEqual('wrap');
    expect(testComponent.fx.fxWrap).toEqual('wrap');
    testComponent.fx.fxWrap = 'wrap';
  });
});

@Component({template: `
  <div a [fxAlign]="['center', 'center']"></div>
  <div b fxAlign="center center"></div>
`})
class FlexAlign {
  @ViewChildren(LyFlex) items: QueryList<LyFlex>;
}
@Component({template: `<div fxAlign></div>`})
class FlexAlignDefault {
  @ViewChild(LyFlex) fx: LyFlex;
}

@Component({template: `<div #fx="lyFx" fxFlow></div>`})
class FlexFlow {
  @ViewChild('fx') fx: LyFlex;
}

@Component({template: `<div #fx="lyFx" fxDisplay="inline"></div>`})
class FlexDisplay {
  @ViewChild('fx') fx: LyFlex;
}

@Component({template: `<div #fx="lyFx" fxDirection></div>`})
class FlexDirection {
  @ViewChild('fx') fx: LyFlex;
}
@Component({template: `<div #fx="lyFx" fxWrap></div>`})
class FlexWrap {
  @ViewChild('fx') fx: LyFlex;
}
