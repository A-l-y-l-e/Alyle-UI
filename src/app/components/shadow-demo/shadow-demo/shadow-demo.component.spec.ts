import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowDemoComponent } from './shadow-demo.component';

describe('ShadowDemoComponent', () => {
  let component: ShadowDemoComponent;
  let fixture: ComponentFixture<ShadowDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShadowDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
