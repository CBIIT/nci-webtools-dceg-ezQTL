import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiQTLComponent } from './mi-qtl.component';

describe('MiQTLComponent', () => {
  let component: MiQTLComponent;
  let fixture: ComponentFixture<MiQTLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiQTLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiQTLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
