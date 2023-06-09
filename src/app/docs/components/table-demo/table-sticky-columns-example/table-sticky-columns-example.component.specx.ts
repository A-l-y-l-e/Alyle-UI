import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStickyColumnsExampleComponent } from './table-sticky-columns-example.component';

describe('TableStickyColumnsExampleComponent', () => {
  let component: TableStickyColumnsExampleComponent;
  let fixture: ComponentFixture<TableStickyColumnsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableStickyColumnsExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableStickyColumnsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
