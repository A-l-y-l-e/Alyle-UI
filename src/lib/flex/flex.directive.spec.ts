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
  it('should apply class based on color attribute', () => {
    const fixture = TestBed.createComponent(FlexAlign);

    const testComponent = fixture.componentInstance;
    const element = fixture.debugElement.nativeElement.querySelector('div');
    fixture.detectChanges();
    expect(element.className.split(' ').length).toEqual(1);
  });
});

@Component({template: `<div [fxAlign]="align"></div>`})
class FlexAlign {
  align = ['center', 'center'];
}
