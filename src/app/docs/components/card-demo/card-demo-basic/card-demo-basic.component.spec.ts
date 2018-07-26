import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDemoBasicComponent } from './card-demo-basic.component';

describe('CardDemoBasicComponent', () => {
  let component: CardDemoBasicComponent;
  let fixture: ComponentFixture<CardDemoBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDemoBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDemoBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
