import { Component, inject } from '@angular/core';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';
import { SnackbarNotificationService } from '../shared/snackbar-notification/snackbar-notification.service';
import { EventoFacultad } from '../../models/eventoFacultad';
import { EventoClub } from '../../models/eventoClub';
import { ServEventosFacultadesService } from '../../services/EventosFacultades/serv-eventos-facultades.service';
import { ServEventosClubesService } from '../../services/EventosClubes/crud-eventos-clubes.service';
import { CardEventoFacultadComponent } from '../EventosFacultades/card-evento-facultad/card-evento-facultad.component';
import { Cuenta, Rol } from '../../models/cuenta';
import { CuentasService } from '../../services/SignupLogin/cuentas.service';
import { AsistenciaEvento } from '../../models/asistenciaEvento';
import { ServAsistenciaEventosService } from '../../services/AsistenciaEventos/serv-asistencia-eventos.service';

@Component({
  selector: 'app-pagina-eventos',
  standalone: true,
  imports: [CardEventoFacultadComponent],
  templateUrl: './pagina-eventos.component.html',
  styleUrl: './pagina-eventos.component.css'
})

export class PaginaEventosComponent {
  private eventosFacultadesService = inject( ServEventosFacultadesService );
  private eventosClubesService = inject( ServEventosClubesService );
  public cuentasService = inject( CuentasService );
  public asistenciaEventosService = inject( ServAsistenciaEventosService );
  private confirmDialog = inject( ConfirmationDialogService );
  private snackBarNotification = inject( SnackbarNotificationService ); // Shared SnackBar para notificaciones consistentes en todo el sitio
  //private searchingSubject = new Subject<string>();
  eventosFacultades: EventoFacultad[] | null = null;
  eventosClubes: EventoClub[] | null = null;
  rolUsuarioLogueado: Rol | null = null;
  asistenciasEventosFacultadEventosIds: number[] = [];
  asistenciasEventosClubEventosIds: number[] = [];
  asistenciasEventos: AsistenciaEvento[] = [];

  ngOnInit(): void {
    this.loadEventosFacultades();
    this.loadEventosClubes();
    this.loadRolUsuarioLogueado();
    this.loadAsistenciasEventos();
    //this.registerSearchingSubjectFunction();
  }

  /*ngOnDestroy(): void {
    this.searchingSubject.complete();
  }*/

  loadEventosFacultades(): void {
    this.eventosFacultadesService.getEventosFacultades().subscribe( ( eventosFacultad: EventoFacultad[] ) => {
      this.eventosFacultades = eventosFacultad;
    });
  }

  loadEventosClubes(): void {
    this.eventosClubesService.obtenerEventos().subscribe( ( eventosClub: EventoClub[] ) => {
      this.eventosClubes = eventosClub;
    });
  }

  loadRolUsuarioLogueado(): void {
    this.cuentasService.rolUsuarioLogueado$.subscribe( ( rol: Rol | null ) => {
      this.rolUsuarioLogueado = rol;
    });
  }

  loadAsistenciasEventos(): void {
    if( this.rolUsuarioLogueado ) {
      this.cuentasService.usuarioLogueado$.subscribe( ( cuenta: Cuenta | null ) => {
        if ( cuenta ) {
          this.asistenciaEventosService.getAsistenciasOfCuentaId( cuenta.id ).subscribe( ( asistencias: AsistenciaEvento[] ) => {
            if ( asistencias ) {
              asistencias.forEach( asistencia => {
                if ( asistencia.idTipoEvento === 1 ) {
                  this.asistenciasEventosFacultadEventosIds.push( asistencia.idEvento );
                }
                else {
                  this.asistenciasEventosClubEventosIds.push( asistencia.idEvento );
                }
              } );

              this.asistenciasEventos = asistencias;
            }
          });
        }
      });
    }
  }

  getAsistenciaUsuarioByEventoId( eventoId: number ) {
    return this.asistenciasEventos.find( asistencia => asistencia.idEvento === eventoId );
  }

  registrarAsistenciaEvento( asistencia: AsistenciaEvento ) {
    if ( this.cuentasService.usuarioLogueado$ ) {
      this.cuentasService.usuarioLogueado$.subscribe( ( cuenta: Cuenta | null ) => {
        asistencia.idCuenta = cuenta?.id as number;

        this.asistenciaEventosService.agregarAsistencia( asistencia ).subscribe( () => {
          if( asistencia.idTipoEvento === 1 ) {
            this.asistenciasEventosFacultadEventosIds.push( asistencia.idEvento );
          }
          else {
            this.asistenciasEventosClubEventosIds.push( asistencia.idEvento );
          }

          this.asistenciasEventos.push( asistencia );
          this.snackBarNotification.openCustomNotification( 'Asistencia Registrada', 'Te inscribiste para asistir al evento!, asistencia registrada exitosamente ✨👌🏼', 'success' );
        });
      });
    }
  }

  eliminarAsistenciaEvento( idAsistenciaEvento: number ) {
    this.asistenciaEventosService.eliminarAsistencia( idAsistenciaEvento ).subscribe( () => {
      this.snackBarNotification.openCustomNotification( "Asistencia eliminada", "Asistencia al evento removida exitosamente 👌🏼", 'success' );
    } );
  }
}
