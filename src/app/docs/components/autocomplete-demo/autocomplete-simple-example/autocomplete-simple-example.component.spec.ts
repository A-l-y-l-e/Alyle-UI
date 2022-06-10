import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteSimpleExampleComponent } from './autocomplete-simple-example.component';

describe('AutocompleteSimpleExampleComponent', () => {
  let component: AutocompleteSimpleExampleComponent;
  let fixture: ComponentFixture<AutocompleteSimpleExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteSimpleExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteSimpleExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
