import { TestBed, inject } from '@angular/core/testing';

import { TwilioService } from './twilio.service';

describe('TwilioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TwilioService]
    });
  });

  it('should be created', inject([TwilioService], (service: TwilioService) => {
    expect(service).toBeTruthy();
  }));
});
