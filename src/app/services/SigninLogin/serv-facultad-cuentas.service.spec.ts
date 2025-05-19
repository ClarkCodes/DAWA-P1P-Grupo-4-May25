import { TestBed } from '@angular/core/testing';

import { ServFacultadCuentasService } from './serv-facultad-cuentas.service';

describe('ServFacultadCuentasService', () => {
  let service: ServFacultadCuentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServFacultadCuentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
