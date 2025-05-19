import { TestBed } from '@angular/core/testing';

import { ServCategoriaDatosService } from './serv-categoria-datos.service';

describe('ServCategoriaDatosService', () => {
  let service: ServCategoriaDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServCategoriaDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
