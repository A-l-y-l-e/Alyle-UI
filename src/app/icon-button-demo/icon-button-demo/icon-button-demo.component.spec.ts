import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButtonDemoComponent } from './icon-button-demo.component';

describe('IconButtonDemoComponent', () => {
  let component: IconButtonDemoComponent;
  let fixture: ComponentFixture<IconButtonDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconButtonDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconButtonDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
