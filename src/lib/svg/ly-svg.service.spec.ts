import { TestBed, inject } from '@angular/core/testing';

import { LySvgService } from './ly-svg.service';

describe('LySvgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LySvgService]
    });
  });

  it('should be created', inject([LySvgService], (service: LySvgService) => {
    expect(service).toBeTruthy();
  }));
});
