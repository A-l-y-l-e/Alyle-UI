import { TestBed, inject } from '@angular/core/testing';

import { TypographyService } from './typography.service';

describe('TypographyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypographyService]
    });
  });

  it('should be created', inject([TypographyService], (service: TypographyService) => {
    expect(service).toBeTruthy();
  }));
});
