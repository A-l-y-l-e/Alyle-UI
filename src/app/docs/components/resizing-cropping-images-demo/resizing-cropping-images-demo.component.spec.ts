import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizingCroppingImagesDemoComponent } from './resizing-cropping-images-demo.component';

describe('ResizingCroppingImagesDemoComponent', () => {
  let component: ResizingCroppingImagesDemoComponent;
  let fixture: ComponentFixture<ResizingCroppingImagesDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizingCroppingImagesDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizingCroppingImagesDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
