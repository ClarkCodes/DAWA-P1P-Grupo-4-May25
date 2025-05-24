import { TestBed } from '@angular/core/testing';

import { ServEventosFacultadesService } from './serv-eventos-facultades.service';

describe('ServEventosFacultadesService', () => {
  let service: ServEventosFacultadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject( ServEventosFacultadesService );
  });

  it('should be created', () => {
    expect( service ).toBeTruthy();
  });
});
