import { TestBed } from '@angular/core/testing';

import { ServClubCuentasService } from './serv-club-cuentas.service';

describe('ServClubCuentasService', () => {
  let service: ServClubCuentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServClubCuentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
