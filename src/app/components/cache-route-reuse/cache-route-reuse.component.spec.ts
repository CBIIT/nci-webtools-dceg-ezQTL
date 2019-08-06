import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheRouteReuseComponent } from './cache-route-reuse.component';

describe('CacheRouteReuseComponent', () => {
  let component: CacheRouteReuseComponent;
  let fixture: ComponentFixture<CacheRouteReuseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CacheRouteReuseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheRouteReuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
