import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqtlInputsComponent } from './eqtl-inputs.component';

describe('EqtlInputsComponent', () => {
  let component: EqtlInputsComponent;
  let fixture: ComponentFixture<EqtlInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqtlInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqtlInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
