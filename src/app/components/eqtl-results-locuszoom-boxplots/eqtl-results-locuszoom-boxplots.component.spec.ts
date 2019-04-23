import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqtlResultsLocuszoomBoxplotsComponent } from './eqtl-results-locuszoom-boxplots.component';

describe('EqtlResultsLocuszoomBoxplotsComponent', () => {
  let component: EqtlResultsLocuszoomBoxplotsComponent;
  let fixture: ComponentFixture<EqtlResultsLocuszoomBoxplotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqtlResultsLocuszoomBoxplotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqtlResultsLocuszoomBoxplotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
