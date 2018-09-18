import { TestBed, inject } from '@angular/core/testing';

import { EqtlResultsService } from './eqtl-results.service';

describe('EqtlResultsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EqtlResultsService]
    });
  });

  it('should be created', inject([EqtlResultsService], (service: EqtlResultsService) => {
    expect(service).toBeTruthy();
  }));
});
