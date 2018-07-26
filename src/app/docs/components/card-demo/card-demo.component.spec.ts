import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDemoComponent } from './card-demo.component';

describe('CardDemoComponent', () => {
  let component: CardDemoComponent;
  let fixture: ComponentFixture<CardDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
