import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BgColorDemoComponent } from './bg-color-demo.component';

describe('BgColorDemoComponent', () => {
  let component: BgColorDemoComponent;
  let fixture: ComponentFixture<BgColorDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgColorDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgColorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
