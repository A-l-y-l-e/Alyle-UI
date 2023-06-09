import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFooterRowExampleComponent } from './table-footer-row-example.component';

describe('TableFooterRowExampleComponent', () => {
  let component: TableFooterRowExampleComponent;
  let fixture: ComponentFixture<TableFooterRowExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableFooterRowExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFooterRowExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
