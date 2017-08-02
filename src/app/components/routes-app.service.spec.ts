import { TestBed, inject } from '@angular/core/testing';

import { RoutesAppService } from './routes-app.service';

describe('RoutesAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutesAppService]
    });
  });

  it('should be created', inject([RoutesAppService], (service: RoutesAppService) => {
    expect(service).toBeTruthy();
  }));
});
