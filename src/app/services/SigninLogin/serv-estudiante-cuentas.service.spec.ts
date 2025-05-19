import { TestBed } from '@angular/core/testing';

import { ServEstudianteCuentasService } from './serv-estudiante-cuentas.service';

describe('ServEstudianteCuentasService', () => {
  let service: ServEstudianteCuentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServEstudianteCuentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
