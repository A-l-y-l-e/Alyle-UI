import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSkeletonComponent } from './basic-skeleton.component';

describe('BasicSkeletonComponent', () => {
  let component: BasicSkeletonComponent;
  let fixture: ComponentFixture<BasicSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
