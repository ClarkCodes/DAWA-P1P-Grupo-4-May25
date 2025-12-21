import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el locale en español

@Pipe( { name: 'timeAgo' } )
export class TimeAgoPipe implements PipeTransform {
  transform( value: string | Date ): string {
    if ( !value )
      return '';

    const date = new Date( value );

    return formatDistanceToNow( date, { // formatDistanceToNow calcula la diferencia entre la fecha y el ahora
      addSuffix: true, // Añade el sufijo "hace" o "en"
      locale: es       // Usa el idioma español
    });
  }
}
