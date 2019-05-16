import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLsLocusTableComponent } from './qtls-locus-table.component';

describe('QTLsLocusTableComponent', () => {
  let component: QTLsLocusTableComponent;
  let fixture: ComponentFixture<QTLsLocusTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLsLocusTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLsLocusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
