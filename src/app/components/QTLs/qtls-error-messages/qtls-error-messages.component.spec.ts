import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLsErrorMessagesComponent } from './qtls-error-messages.component';

describe('QTLsErrorMessagesComponent', () => {
  let component: QTLsErrorMessagesComponent;
  let fixture: ComponentFixture<QTLsErrorMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLsErrorMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLsErrorMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
