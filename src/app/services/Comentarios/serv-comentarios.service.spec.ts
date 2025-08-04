import { TestBed } from '@angular/core/testing';
import { ServComentariosService } from './serv-comentarios.service';

describe('ServGetComentariosService', () => {
  let service: ServComentariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject( ServComentariosService );
  });

  it('should be created', () => {
    expect( service ).toBeTruthy();
  });
});
