import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperWithColorComponent } from './paper-with-color.component';

describe('PaperWithColorComponent', () => {
  let component: PaperWithColorComponent;
  let fixture: ComponentFixture<PaperWithColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperWithColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperWithColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
