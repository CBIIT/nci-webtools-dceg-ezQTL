import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqtlResultsLocuszoomComponent } from './eqtl-results-locuszoom.component';

describe('EqtlResultsLocuszoomComponent', () => {
  let component: EqtlResultsLocuszoomComponent;
  let fixture: ComponentFixture<EqtlResultsLocuszoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqtlResultsLocuszoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqtlResultsLocuszoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
