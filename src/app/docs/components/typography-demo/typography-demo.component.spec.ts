import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypographyDemoComponent } from '@docs/components/typography-demo/typography-demo.component';

describe('TypographyDemoComponent', () => {
  let component: TypographyDemoComponent;
  let fixture: ComponentFixture<TypographyDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypographyDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypographyDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
