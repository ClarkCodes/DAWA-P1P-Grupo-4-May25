import { TestBed } from '@angular/core/testing';

import { ServFacultadesService } from './serv-facultades.service';

describe('ServGetFacultadesService', () => {
  let service: ServFacultadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject( ServFacultadesService );
  });

  it('should be created', () => {
    expect( service ).toBeTruthy();
  });
});
