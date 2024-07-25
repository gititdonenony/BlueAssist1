import { TestBed } from '@angular/core/testing';

import { CameraCapacitorService } from './camera-capacitor.service';

describe('CameraCapacitorService', () => {
  let service: CameraCapacitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraCapacitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
