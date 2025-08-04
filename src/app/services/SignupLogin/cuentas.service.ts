import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cuenta, Rol } from '../../models/cuenta';
import { Facultad } from '../../models/facultad';
import { SnackbarNotificationService } from '../../components/shared/snackbar-notification/snackbar-notification.service';
import { Club } from '../../models/eventoClub';
import { Router } from '@angular/router';

// Decorador que marca la clase como un servicio inyectable, disponible en el ámbito raíz
@Injectable({ providedIn: 'root' })
export class CuentasService {
  private router = inject( Router );
  // URL del endpoint para el JSON Server
  private jsonCuentasUrl: string = 'http://localhost:3000/Cuentas';
  private jsonRolesUrl: string = 'http://localhost:3000/Roles';
  private jsonFacultadesUrl: string = 'http://localhost:3000/facultadDatos'; // Url del Endpoint de Facultades del Json Server
  private jsonClubesUrl: string = 'http://localhost:3000/clubes'; // Url del Endpoint de Facultades del Json Server

  // Objeto de la cuenta del usuario logueado
  private usuarioLogueadoSubject = new BehaviorSubject<Cuenta | null>(null);
  public usuarioLogueado$: Observable<Cuenta | null> = this.usuarioLogueadoSubject.asObservable();
  private rolUsuarioLogueadoSubject = new BehaviorSubject<Rol | null>(null);
  public rolUsuarioLogueado$: Observable<Rol | null> = this.rolUsuarioLogueadoSubject.asObservable();

  // Shared SnackBar para notificaciones consistentes en todo el sitio
  private snackBarNotification = inject( SnackbarNotificationService );

  // Inyección del servicio HttpClient para realizar peticiones HTTP
  constructor(
    private http: HttpClient
  ) {
    const cuentaUsuarioGuardada = localStorage.getItem( 'usuarioLogueado' );
    const rolUsuarioGuardado = localStorage.getItem( 'rolUsuarioLogueado' );

    if ( cuentaUsuarioGuardada ) {
      const cuenta = JSON.parse( cuentaUsuarioGuardada );
      this.usuarioLogueadoSubject.next( cuenta );
    }

    if ( rolUsuarioGuardado ) {
      const rol = JSON.parse( rolUsuarioGuardado );
      this.rolUsuarioLogueadoSubject.next( rol );
    }
  }

  // Obtiene la lista de cuentas desde el servidor
  getCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.jsonCuentasUrl);
  }

  getCuentaById( id: number ): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>( `${this.jsonCuentasUrl}?id=${id}` );
  }

  getCuentaByNombre( nombre: string ): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>( `${this.jsonCuentasUrl}?nombre=${nombre}` );
  }

  getCuentaByEmail( email: string ): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>( `${this.jsonCuentasUrl}?email=${email}` );
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>( this.jsonRolesUrl );
  }

  getRolById( id: string ): Observable<Rol[]> {
    return this.http.get<Rol[]>( `${this.jsonRolesUrl}?id=${id}` );
  }

  getFacultades(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>( this.jsonFacultadesUrl );
  }

  getFacultadById( id: string ): Observable<Facultad[]> {
    return this.http.get<Facultad[]>( `${this.jsonFacultadesUrl}?id=${id}` );
  }

  getClubes(): Observable<Club[]> {
    return this.http.get<Club[]>( this.jsonClubesUrl );
  }

  getClubById( id: string ): Observable<Club[]> {
    return this.http.get<Club[]>( `${this.jsonClubesUrl}?id=${id}` );
  }

  /* generateNewId(): number | undefined {
    this.getCuentas().subscribe( ( cuentas: Cuenta[] ) => {
      if( cuentas ){
        let topId = 0;
        cuentas.forEach( cuenta => {
          if( cuenta.id > topId )
            topId = cuenta.id;
        });

        return topId + 1;
      }

      return;
    });

    return;
  } */

  // Agrega una nueva cuenta al servidor
  addCuentas(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(this.jsonCuentasUrl, cuenta);
  }

  // Actualiza una cuenta existente en el servidor
  editCuentas(cuenta: Cuenta): Observable<Cuenta> {
    const cuentaUrl = `${this.jsonCuentasUrl}/${cuenta.id}`;
    return this.http.put<Cuenta>(cuentaUrl, cuenta);
  }

  // Actualiza una cuenta existente en el servidor enviando datos parciales con solo los que se actualicen usando patch
  updateCuenta( id: number, cuentaUpdatedData: Partial<Cuenta> ): Observable<Cuenta> {
    const cuentaUrl = `${this.jsonCuentasUrl}/${id}`;
    return this.http.patch<Cuenta>( cuentaUrl, cuentaUpdatedData );
  }

  // Elimina una cuenta del servidor
  deleteCuentas( cuenta: Cuenta ): Observable<void> {
    const cuentaUrl = `${this.jsonCuentasUrl}/${cuenta.id}`;
    return this.http.delete<void>(cuentaUrl);
  }

  // Valida las credenciales de un usuario, realiza los pasos de inicio de sesion y devuelve true si fue exitoso, false si no se inicio la sesion o si hubo algun error
  login( email: string, password: string ): void {
    this.getCuentaByEmail( email ).subscribe({
      next:( cuentaEncontrada: Cuenta[] ) => {
        const cuenta = cuentaEncontrada[0]; // Si existe el correo el primer itel del arreglo devuelve la cuenta sino devuelve null
        if ( cuenta ) { // Si existe la cuenta, significa que estaba registrada y por lo tanto es valida
          // Validar las credenciales
          if ( cuenta.password === password ) { // Ahora se solo falta validar la contrasenia
            this.setCuentaLogueada( cuenta );
          } else {
            this.snackBarNotification.openCustomNotification( 'ACCESO DENEGADO', 'Revisar credenciales', 'error' );
          }
        }
        else {
          this.snackBarNotification.openCustomNotification( 'Usuario no registrado', 'Intente con otro email o cree una cuenta nueva', 'warning' );
        }
      },
      error: ( err ) => {
        console.error( 'Error al consultar usuarios:', err );
        this.snackBarNotification.openCustomNotification( 'Error al consultar usuarios', `${err}`, 'error' );
      }
    });
  }

  loginRouter( rolName: string ) {
    // Redirigir según el rol del usuario
    switch ( rolName ) {
      case 'ESTUDIANTE':
        this.router.navigate(['/eventos']);
        break;
      case 'FACULTAD':
        this.router.navigate(['/crud-eventos-facultades']);
        break;
      case 'CLUB':
        this.router.navigate(['/crud-eventos-clubes']);
        break;
      case 'ADMINISTRADOR':
        this.router.navigate(['/crud-admin-panel']);
        break;
      default:
        this.snackBarNotification.openCustomNotification( 'Rol desconocido', `Desconocido: ${rolName}`, 'error' );
        break;
    }
  }

  logout() {
    this.usuarioLogueadoSubject.next( null );
    this.rolUsuarioLogueadoSubject.next( null );
    localStorage.removeItem( 'usuarioLogueado' );
    localStorage.removeItem( 'rolUsuarioLogueado' );
  }

  setCuentaLogueada( cuenta: Cuenta ): void {
    this.usuarioLogueadoSubject.next( cuenta );
    localStorage.setItem( 'usuarioLogueado', JSON.stringify( cuenta ) );

    this.getRolById( cuenta.idRol ).subscribe({ // Se obtiene el rol del usuario logueado y se lo guarda en su variable respectiva
      next: ( roles: Rol[] ) => {
        if ( roles.length > 0 ) {
          this.rolUsuarioLogueadoSubject.next( roles[0] );
          localStorage.setItem( 'rolUsuarioLogueado', JSON.stringify( roles[0] ) );
        } else {
          console.error( 'No se encontró el rol para la cuenta logueada.' );
        }
      },
      error: ( err ) => {
        console.error( 'Error al obtener el rol: ', err );
      }
    });
  }

  // Cuando se actualiza una cuenta por el propio usuario o por el administrador se verifica si la cuenta logueada es la actualizada y se reemplaza el objeto de cuenta de la sesion actual con el objeto de cuenta actualizado para que refleje los datos actualizados
  refrezcarCuentaActualizada( cuentaActualizada: Cuenta ) {
    this.usuarioLogueado$.subscribe( ( cuenta: Cuenta | null ) => {
      if ( cuenta?.id === cuentaActualizada.id ) {
        this.setCuentaLogueada( cuentaActualizada );
      }
    });
  }

  resetCuentaActualizada( idCuenta: number ) {
    this.getCuentaById( idCuenta ).subscribe( ( cuentaActualizada: Cuenta[] ) => {
      if( cuentaActualizada ) {
        this.setCuentaLogueada( cuentaActualizada[0] );
      }
    });
  }

  /* Codigo para conectarse con la API del Backend, por ahora esta en estado pendiente StandBy, por eso esta comentado, decidire que se hara con este codigo, si se eliminara o se usara, posteriormente

  private apiCuentasUrl: string = 'http://localhost:5214/api/Cuentas';

  getCuentas(): Observable<Cuentas[]> {
    return this.http.get<Cuentas[]>(this.apiCuentasUrl).pipe(
      catchError(error => {
        console.error('Error al obtener cuentas:', error);
        return throwError(() => new Error(error.error || 'No se pudo obtener la lista de cuentas.'));
      })
    );
  }

  getFacultades(): Observable<FacultadDatos[]> {
    return this.http.get<FacultadDatos[]>(`${this.apiCuentasUrl}/facultades`).pipe(
      catchError(error => {
        console.error('Error al obtener facultades:', error);
        return throwError(() => new Error(error.error || 'No se pudo obtener la lista de facultades.'));
      })
    );
  }

  getRoles(): Observable<RolDatos[]> {
    return this.http.get<RolDatos[]>(`${this.apiCuentasUrl}/roles`).pipe(
      catchError(error => {
        console.error('Error al obtener roles:', error);
        return throwError(() => new Error(error.error || 'No se pudo obtener la lista de roles.'));
      })
    );
  }

  addCuentas(cuenta: CreateCuentas): Observable<Cuentas> {
    return this.http.post<Cuentas>(this.apiCuentasUrl, cuenta).pipe(
      catchError(error => {
        console.error('Error al crear cuenta:', error);
        return throwError(() => new Error(error.error || 'No se pudo crear la cuenta.'));
      })
    );
  }

editCuentas(id: number, cuenta: Partial<Cuentas>): Observable<void> {
    const cuentaDto = {
      nombre: cuenta.nombre,
      email: cuenta.email,
      password: cuenta.password,
      facultadId: cuenta.facultadId,
      rolId: cuenta.rolId
    };
    return this.http.put<void>(`${this.apiCuentasUrl}/${id}`, cuentaDto);
  }

  deleteCuentas(id: number): Observable<void> {
    const cuentaUrl = `${this.apiCuentasUrl}/${id}`;
    return this.http.delete<void>(cuentaUrl).pipe(
      catchError(error => {
        console.error('Error al eliminar cuenta:', error);
        return throwError(() => new Error(error.error || 'No se pudo eliminar la cuenta.'));
      })
    );
  }

  login(email: string, password: string): Observable<Cuentas> {
    return this.http.post<Cuentas>(`${this.apiCuentasUrl}/login`, { email, password }).pipe(
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error(error.error || 'Credenciales inválidas'));
      })
    );
  */

}
