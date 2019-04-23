import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqtlMessagesComponent } from './eqtl-messages.component';

describe('EqtlMessagesComponent', () => {
  let component: EqtlMessagesComponent;
  let fixture: ComponentFixture<EqtlMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqtlMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqtlMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
