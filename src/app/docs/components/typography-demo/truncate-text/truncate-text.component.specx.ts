import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruncateTextComponent } from './truncate-text.component';

describe('TruncateTextComponent', () => {
  let component: TruncateTextComponent;
  let fixture: ComponentFixture<TruncateTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruncateTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruncateTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
