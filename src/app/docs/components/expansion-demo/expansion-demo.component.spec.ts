import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionDemoComponent } from './expansion-demo.component';

describe('ExpansionDemoComponent', () => {
  let component: ExpansionDemoComponent;
  let fixture: ComponentFixture<ExpansionDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpansionDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
