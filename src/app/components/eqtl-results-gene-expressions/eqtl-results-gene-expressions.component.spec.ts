import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqtlResultsGeneExpressionsComponent } from './eqtl-results-gene-expressions.component';

describe('EqtlResultsGeneExpressionsComponent', () => {
  let component: EqtlResultsGeneExpressionsComponent;
  let fixture: ComponentFixture<EqtlResultsGeneExpressionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqtlResultsGeneExpressionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqtlResultsGeneExpressionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
