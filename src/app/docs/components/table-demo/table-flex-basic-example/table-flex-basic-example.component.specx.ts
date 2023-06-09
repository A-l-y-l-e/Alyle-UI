import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFlexBasicExampleComponent } from './table-flex-basic-example.component';

describe('TableFlexBasicExampleComponent', () => {
  let component: TableFlexBasicExampleComponent;
  let fixture: ComponentFixture<TableFlexBasicExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableFlexBasicExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFlexBasicExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
