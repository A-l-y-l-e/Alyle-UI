import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperDemoComponent } from './paper-demo.component';

describe('PaperDemoComponent', () => {
  let component: PaperDemoComponent;
  let fixture: ComponentFixture<PaperDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
