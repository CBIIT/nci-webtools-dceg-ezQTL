import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SQTLComponent } from './s-qtl.component';

describe('SQTLComponent', () => {
  let component: SQTLComponent;
  let fixture: ComponentFixture<SQTLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SQTLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SQTLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
