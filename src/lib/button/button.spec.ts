import {
  async,
  fakeAsync,
  inject,
  tick,
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { By } from '@angular/platform-browser';
import { MockBackend } from '@angular/http/testing';

// Load the implementations that should be tested
import { LyButtonComponentModule } from './button';

describe('LyButton', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LyButtonComponentModule.forRoot()],
      declarations: [TestComponent]
    });

    TestBed.compileComponents();
  }));

  it('should apply background based on bg attribute', () => {
    const fixture = TestBed.createComponent(TestComponent);

    const testComponent = fixture.debugElement.componentInstance;
    const buttonDebugElement = fixture.debugElement.query(By.css('button'));

    testComponent.bg = '#009688';
    fixture.detectChanges();
    expect(buttonDebugElement.nativeElement.style.background).toBe('rgb(0, 150, 136)');

    // testComponent.buttonColor = 'accent';
    // fixture.detectChanges();
    // expect(buttonDebugElement.nativeElement.classList.contains('md-accent')).toBe(true);
  });
  it('should disable the native button element', () => {
      const fixture = TestBed.createComponent(TestComponent);
      const buttonNativeElement = fixture.nativeElement.querySelector('button');
      expect(buttonNativeElement.disabled).toBeFalsy('Expected button not to be disabled');

      fixture.componentInstance.disable = true;
      fixture.detectChanges();
      expect(buttonNativeElement.disabled).toBeTruthy('Expected button to be disabled');
    });

});
// Create a test component to test directives
@Component({
  selector: 'test-button',
  template: '<button [bg]="bg" [disabled]="disable" ly-button>Content</button>'
})
class TestComponent {
  disable = false;
}
