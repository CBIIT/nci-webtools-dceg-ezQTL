import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EQTLComponent } from './e-qtl.component';

describe('EQTLComponent', () => {
  let component: EQTLComponent;
  let fixture: ComponentFixture<EQTLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EQTLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EQTLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
