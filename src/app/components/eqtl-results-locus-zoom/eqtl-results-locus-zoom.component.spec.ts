import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqtlResultsLocusZoomComponent } from './eqtl-results-locus-zoom.component';

describe('EqtlResultsLocusZoomComponent', () => {
  let component: EqtlResultsLocusZoomComponent;
  let fixture: ComponentFixture<EqtlResultsLocusZoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqtlResultsLocusZoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqtlResultsLocusZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
