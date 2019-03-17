import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicExpansionComponent } from './basic-expansion.component';

describe('BasicExpansionComponent', () => {
  let component: BasicExpansionComponent;
  let fixture: ComponentFixture<BasicExpansionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicExpansionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
