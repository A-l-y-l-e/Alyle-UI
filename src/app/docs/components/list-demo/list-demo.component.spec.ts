import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDemoComponent } from './list-demo.component';

describe('ListDemoComponent', () => {
  let component: ListDemoComponent;
  let fixture: ComponentFixture<ListDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
