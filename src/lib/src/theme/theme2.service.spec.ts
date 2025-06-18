import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AUIThemeModule } from '@testing/theme.module';

import { lyl } from '../parse';
import { LyTheme2 } from './theme2.service';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AUIThemeModule,
      ],
      declarations: [ MyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('add style containers sorted by priority', () => {
    const containerStyleList: Element[] = [];
    document.body.querySelectorAll('ly-s-c').forEach(child => {
      containerStyleList.push(child);
    });
    expect(containerStyleList.length)
      .withContext('count 4 style containers')
      .toEqual(4);
    expect(containerStyleList.map(item => Number(item.getAttribute('priority')!)).join(' '))
      .withContext('the styles should be sorted by priority')
      .toEqual([-2, -1, -0.5, 0].join(' '));
  });
});

@Component({
  template: ` `,
  standalone: false
})
class MyComponent {
  constructor(
    theme: LyTheme2
  ) {
    [-0.5, -1, -2, 0].forEach(priority => {
      theme.renderStyle(`${Math.random()}`, () => lyl `{
        color: rgb(0, 0, 0)
      }`, priority);
    });
  }
}
