import { TestBed, inject } from '@angular/core/testing';

import { AxesService } from './axes.service';

describe('AxesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AxesService]
    });
  });

  it('should be created', inject([AxesService], (service: AxesService) => {
    expect(service).toBeTruthy();
  }));
});
