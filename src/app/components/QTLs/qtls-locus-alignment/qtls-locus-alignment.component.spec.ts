import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLsLocusAlignmentComponent } from './qtls-locus-alignment.component';

describe('QTLsLocusAlignmentComponent', () => {
  let component: QTLsLocusAlignmentComponent;
  let fixture: ComponentFixture<QTLsLocusAlignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLsLocusAlignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLsLocusAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
