import { TestBed } from '@angular/core/testing';

import { ServFacultadDatosService } from './serv-facultad-datos.service';

describe('ServFacultadDatosService', () => {
  let service: ServFacultadDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServFacultadDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
