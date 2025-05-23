import { TestBed } from '@angular/core/testing';

import { EventosService } from './crud-eventos-clubes.service';

describe('EventoService', () => {
  let service: EventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});