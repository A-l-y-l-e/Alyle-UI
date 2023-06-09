import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableUsingNgForExampleComponent } from './table-using-ng-for-example.component';

describe('TableUsingNgForExampleComponent', () => {
  let component: TableUsingNgForExampleComponent;
  let fixture: ComponentFixture<TableUsingNgForExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableUsingNgForExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableUsingNgForExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
