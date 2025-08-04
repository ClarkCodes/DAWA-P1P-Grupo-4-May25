import { TestBed } from '@angular/core/testing';

import { ServLoginService } from './serv-login.service';

describe('ServLoginService', () => {
  let service: ServLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
