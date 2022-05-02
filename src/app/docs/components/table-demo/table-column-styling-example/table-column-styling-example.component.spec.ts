import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColumnStylingExampleComponent } from './table-column-styling-example.component';

describe('TableColumnStylingExampleComponent', () => {
  let component: TableColumnStylingExampleComponent;
  let fixture: ComponentFixture<TableColumnStylingExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableColumnStylingExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableColumnStylingExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
