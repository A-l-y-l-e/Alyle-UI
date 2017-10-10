import { TestBed, inject } from '@angular/core/testing';

import { LyCheckboxService } from './ly-checkbox.service';

describe('LyCheckboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LyCheckboxService]
    });
  });

  it('should be created', inject([LyCheckboxService], (service: LyCheckboxService) => {
    expect(service).toBeTruthy();
  }));
});
