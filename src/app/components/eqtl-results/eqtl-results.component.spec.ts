import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqtlResultsComponent } from './eqtl-results.component';

describe('EqtlResultsComponent', () => {
  let component: EqtlResultsComponent;
  let fixture: ComponentFixture<EqtlResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqtlResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqtlResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
