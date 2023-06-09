import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldWithPrefixAndSuffixComponent } from './field-with-prefix-and-suffix.component';

describe('FieldWithPrefixAndSuffixComponent', () => {
  let component: FieldWithPrefixAndSuffixComponent;
  let fixture: ComponentFixture<FieldWithPrefixAndSuffixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldWithPrefixAndSuffixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldWithPrefixAndSuffixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
