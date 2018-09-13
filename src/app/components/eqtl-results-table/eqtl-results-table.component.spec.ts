import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqtlResultsTableComponent } from './eqtl-results-table.component';

describe('EqtlResultsTableComponent', () => {
  let component: EqtlResultsTableComponent;
  let fixture: ComponentFixture<EqtlResultsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqtlResultsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqtlResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
