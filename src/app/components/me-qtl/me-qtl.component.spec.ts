import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeQTLComponent } from './me-qtl.component';

describe('MeQTLComponent', () => {
  let component: MeQTLComponent;
  let fixture: ComponentFixture<MeQTLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeQTLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeQTLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
