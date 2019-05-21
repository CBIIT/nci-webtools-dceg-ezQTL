import { TestBed, inject } from '@angular/core/testing';

import { QTLsResultsService } from './qtls-results.service';

describe('QTLsResultsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QTLsResultsService]
    });
  });

  it('should be created', inject([QTLsResultsService], (service: QTLsResultsService) => {
    expect(service).toBeTruthy();
  }));
});
