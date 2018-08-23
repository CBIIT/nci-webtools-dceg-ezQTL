import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTLInteractionComponent } from './qtl-interaction.component';

describe('QTLInteractionComponent', () => {
  let component: QTLInteractionComponent;
  let fixture: ComponentFixture<QTLInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTLInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTLInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
