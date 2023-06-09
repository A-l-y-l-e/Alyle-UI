import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypographyDemoBasicComponent } from '@docs/components/typography-demo/typography-demo-basic/typography-demo-basic.component';

describe('TypographyDemoBasicComponent', () => {
  let component: TypographyDemoBasicComponent;
  let fixture: ComponentFixture<TypographyDemoBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypographyDemoBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypographyDemoBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
