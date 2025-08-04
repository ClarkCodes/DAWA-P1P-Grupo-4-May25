import { TestBed } from '@angular/core/testing';

import { ServEventosClubesService } from './crud-eventos-clubes.service';

describe('EventoService', () => {
  let service: ServEventosClubesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServEventosClubesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
