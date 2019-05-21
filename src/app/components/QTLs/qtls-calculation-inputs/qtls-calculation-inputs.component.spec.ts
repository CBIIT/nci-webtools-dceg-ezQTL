import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLsCalculationInputsComponent } from './qtls-calculation-inputs.component';

describe('QTLsCalculationInputsComponent', () => {
  let component: QTLsCalculationInputsComponent;
  let fixture: ComponentFixture<QTLsCalculationInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLsCalculationInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLsCalculationInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
