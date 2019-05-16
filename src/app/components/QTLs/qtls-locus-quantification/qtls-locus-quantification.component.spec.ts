import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLsLocusQuanitificationComponent } from './qtls-locus-quantification.component';

describe('QTLsLocusQuanitificationComponent', () => {
  let component: QTLsLocusQuanitificationComponent;
  let fixture: ComponentFixture<QTLsLocusQuanitificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLsLocusQuanitificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLsLocusQuanitificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
