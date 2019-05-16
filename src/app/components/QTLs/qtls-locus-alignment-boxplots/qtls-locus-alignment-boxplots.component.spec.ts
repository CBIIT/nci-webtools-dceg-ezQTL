import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLsLocusAlignmentBoxplotsComponent } from './qtls-locus-alignment-boxplots.component';

describe('QTLsLocusAlignmentBoxplotsComponent', () => {
  let component: QTLsLocusAlignmentBoxplotsComponent;
  let fixture: ComponentFixture<QTLsLocusAlignmentBoxplotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLsLocusAlignmentBoxplotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLsLocusAlignmentBoxplotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
