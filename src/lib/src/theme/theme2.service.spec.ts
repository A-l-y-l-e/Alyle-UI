import { TestBed, inject } from '@angular/core/testing';

import { Theme2Service } from './theme2.service';

describe('Theme2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Theme2Service]
    });
  });

  it('should be created', inject([Theme2Service], (service: Theme2Service) => {
    expect(service).toBeTruthy();
  }));
});
