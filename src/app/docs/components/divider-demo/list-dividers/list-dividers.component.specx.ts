import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDividersComponent } from './list-dividers.component';

describe('ListDividersComponent', () => {
  let component: ListDividersComponent;
  let fixture: ComponentFixture<ListDividersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDividersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDividersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
