import { inject, async, fakeAsync, tick, TestBed } from '@angular/core/testing';
import { LyFlexModule } from './index';
import { Renderer2, ElementRef, Component } from '@angular/core';

describe('LyFlex', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LyFlexModule],
      declarations: [
        FlexAlign
      ]
    });

    TestBed.compileComponents();
  }));
  it('should add custom class based on fxAlign attribute', () => {
    const fixture = TestBed.createComponent(FlexAlign);

    const testComponent = fixture.componentInstance;
    const element = fixture.debugElement.nativeElement.querySelector('div');
    fixture.detectChanges();
    const computedStyle = getComputedStyle(element);
    expect(element.className.split(' ').length).toEqual(1);
    expect(computedStyle.justifyContent).toEqual('center');
    expect(computedStyle.alignItems).toEqual('center');
    expect(computedStyle.alignContent).toEqual('center');
  });
});

@Component({template: `<div [fxAlign]="align"></div>`})
class FlexAlign {
  align = ['center', 'center'];
}
