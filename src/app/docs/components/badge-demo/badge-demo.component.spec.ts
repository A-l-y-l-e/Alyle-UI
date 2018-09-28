import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeDemoComponent } from './badge-demo.component';

describe('BadgeDemoComponent', () => {
  let component: BadgeDemoComponent;
  let fixture: ComponentFixture<BadgeDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
