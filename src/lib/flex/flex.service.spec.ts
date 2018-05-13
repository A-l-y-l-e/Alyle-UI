import { TestBed, inject } from '@angular/core/testing';

import { AlignService } from './align.service';

describe('AlignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlignService]
    });
  });

  it('should be created', inject([AlignService], (service: AlignService) => {
    expect(service).toBeTruthy();
  }));
});
