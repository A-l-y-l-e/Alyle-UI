import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicUsesAvatarComponent } from './basic-uses-avatar.component';

describe('BasicUsesAvatarComponent', () => {
  let component: BasicUsesAvatarComponent;
  let fixture: ComponentFixture<BasicUsesAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicUsesAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicUsesAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
