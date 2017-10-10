import { TestBed, inject } from '@angular/core/testing';

import { CarouselService } from './carousel.service';

describe('CarouselService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarouselService]
    });
  });

  it('should be created', inject([CarouselService], (service: CarouselService) => {
    expect(service).toBeTruthy();
  }));
});
