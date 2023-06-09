import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicPaperComponent } from './basic-paper.component';

describe('BasicPaperComponent', () => {
  let component: BasicPaperComponent;
  let fixture: ComponentFixture<BasicPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
