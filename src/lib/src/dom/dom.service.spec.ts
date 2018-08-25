/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Dom.service.tsService } from './dom.service.ts.service';

describe('Service: Dom.service.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Dom.service.tsService]
    });
  });

  it('should ...', inject([Dom.service.tsService], (service: Dom.service.tsService) => {
    expect(service).toBeTruthy();
  }));
});
