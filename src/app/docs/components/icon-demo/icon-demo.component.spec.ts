import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDemoComponent } from './icon-demo.component';

describe('IconDemoComponent', () => {
  let component: IconDemoComponent;
  let fixture: ComponentFixture<IconDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
