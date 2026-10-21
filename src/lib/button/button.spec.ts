import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LY_THEME, LyCommonModule, LyThemeModule } from '@alyle/ui';
import { LyButtonModule } from '@alyle/ui/button';
import { MinimaLight } from '@alyle/ui/themes/minima';

@Component({
  selector: 'ly-button-disabled-anchor-test-host',
  template: `
    <a
      id="disabled-link"
      ly-button
      [disabled]="disabled"
      href="#activated"
      (click)="onLinkClick()"
    >Go</a>
    <a
      id="custom-link"
      ly-button
      [disabled]="disabled"
      tabindex="4"
      aria-disabled="false"
      href="#custom"
    >Custom</a>
    <button id="disabled-button" ly-button [disabled]="disabled">Native button</button>
  `,
  standalone: false
})
class DisabledAnchorHostComponent {
  disabled = true;
  clickCount = 0;

  onLinkClick() {
    this.clickCount++;
  }
}

describe('LyButton disabled anchor accessibility', () => {
  let fixture: ComponentFixture<DisabledAnchorHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LyCommonModule,
        LyButtonModule,
        LyThemeModule.setTheme('minima-light')
      ],
      declarations: [DisabledAnchorHostComponent],
      providers: [
        { provide: LY_THEME, useClass: MinimaLight, multi: true }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DisabledAnchorHostComponent);
    fixture.detectChanges();
  });

  it('exposes disabled state and removes anchors from the tab order', () => {
    const link = fixture.nativeElement.querySelector(
      '#disabled-link'
    ) as HTMLAnchorElement & { disabled: boolean };
    const customLink = fixture.nativeElement.querySelector(
      '#custom-link'
    ) as HTMLAnchorElement & { disabled: boolean };

    expect(link.disabled).toBeTrue();
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');
    expect(link.matches(':disabled')).toBeFalse();

    expect(customLink.getAttribute('aria-disabled')).toBe('true');
    expect(customLink.getAttribute('tabindex')).toBe('-1');

    const button = fixture.nativeElement.querySelector(
      '#disabled-button'
    ) as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
    expect(button.getAttribute('aria-disabled')).toBeNull();
    expect(button.getAttribute('tabindex')).toBeNull();
  });

  it('blocks activation while disabled and restores authored attributes when re-enabled', () => {
    const link = fixture.nativeElement.querySelector(
      '#disabled-link'
    ) as HTMLAnchorElement & { disabled: boolean };
    const customLink = fixture.nativeElement.querySelector(
      '#custom-link'
    ) as HTMLAnchorElement & { disabled: boolean };
    const initialHash = location.hash;
    link.click();
    expect(location.hash).toBe(initialHash);
    expect(fixture.componentInstance.clickCount).toBe(0);

    fixture.componentInstance.disabled = false;
    fixture.detectChanges();

    expect(link.getAttribute('aria-disabled')).toBeNull();
    expect(link.getAttribute('tabindex')).toBeNull();
    expect(link.tabIndex).toBe(0);
    expect(customLink.getAttribute('aria-disabled')).toBe('false');
    expect(customLink.getAttribute('tabindex')).toBe('4');

    link.removeAttribute('href');
    const enabledClick = new MouseEvent(
      'click',
      { bubbles: true, cancelable: true }
    );
    link.dispatchEvent(enabledClick);
    expect(enabledClick.defaultPrevented).toBeFalse();
    expect(fixture.componentInstance.clickCount).toBe(1);
  });
});
