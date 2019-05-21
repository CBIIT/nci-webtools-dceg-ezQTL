import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLsDataInputsComponent } from './qtls-data-inputs.component';

describe('QTLsDataInputsComponent', () => {
  let component: QTLsDataInputsComponent;
  let fixture: ComponentFixture<QTLsDataInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLsDataInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLsDataInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
