import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarWithButtonComponent } from './avatar-with-button.component';

describe('AvatarWithButtonComponent', () => {
  let component: AvatarWithButtonComponent;
  let fixture: ComponentFixture<AvatarWithButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarWithButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarWithButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
