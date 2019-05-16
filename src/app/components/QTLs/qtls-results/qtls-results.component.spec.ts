import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLsResultsComponent } from './qtls-results.component';

describe('QTLsResultsService', () => {
  let component: QTLsResultsComponent;
  let fixture: ComponentFixture<QTLsResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLsResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
