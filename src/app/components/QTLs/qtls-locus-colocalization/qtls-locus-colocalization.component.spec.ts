import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtlsLocusColocalizationComponent } from './qtls-locus-colocalization.component';

describe('QtlsLocusColocalizationComponent', () => {
  let component: QtlsLocusColocalizationComponent;
  let fixture: ComponentFixture<QtlsLocusColocalizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtlsLocusColocalizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtlsLocusColocalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
