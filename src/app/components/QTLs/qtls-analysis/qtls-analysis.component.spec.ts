import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLsComponent } from './qtls-analysis.component';

describe('QTLsComponent', () => {
  let component: QTLsComponent;
  let fixture: ComponentFixture<QTLsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
