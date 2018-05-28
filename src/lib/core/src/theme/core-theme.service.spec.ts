import { TestBed, inject } from '@angular/core/testing';

import { CoreThemeService } from './core-theme.service';

describe('CoreThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreThemeService]
    });
  });

  it('should be created', inject([CoreThemeService], (service: CoreThemeService) => {
    expect(service).toBeTruthy();
  }));
});
