import { TestBed } from '@angular/core/testing';

import { ServRolDatosService } from './serv-rol-datos.service';

describe('ServRolDatosService', () => {
  let service: ServRolDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServRolDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
