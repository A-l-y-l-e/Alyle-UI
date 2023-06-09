import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsCssDeclarationsBlockComponent } from './ds-css-declarations-block.component';

describe('DsCssDeclarationsBlockComponent', () => {
  let component: DsCssDeclarationsBlockComponent;
  let fixture: ComponentFixture<DsCssDeclarationsBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsCssDeclarationsBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsCssDeclarationsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
