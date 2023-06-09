import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniDrawerComponent } from './mini-drawer.component';

describe('MiniDrawerComponent', () => {
  let component: MiniDrawerComponent;
  let fixture: ComponentFixture<MiniDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
