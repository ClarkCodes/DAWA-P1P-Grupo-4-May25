import { Observable } from "rxjs";

export enum RolEnum {
  ADMINISTRADOR = 1,
  ESTUDIANTE = 2,
  FACULTAD = 3,
  CLUB = 4
}

/**
 * Handles image loading errors by setting a default image source, so it sets the source of the image to a default "no image found" placeholder.
 * @param imgElement The image element that will have its source changed to a default image if an error occurs,
 * this is typically used in the `onerror` event of an image to handle cases where the image fails to load
 */
export function onImageError( imgElement: HTMLImageElement ) {
  imgElement.src = '/images/no-image-found-design.webp';
}

export function getUserName( name: string ): string {
  const distName: string | string[] = name.includes( ' ' ) ? name?.split( ' ' ) : name; // Distributed Name
  return Array.isArray( distName ) ? ( `${distName[0]} ${distName[1]}` ) : distName as string;
}

export function getRolEnumKeyNameByStrId( strId: string ): string | undefined {
  return RolEnum[Number( strId )];
}

export function getRolEnumByStrId( strId: string ): RolEnum | undefined {
  switch( strId ) {
    case '1':
      return RolEnum.ADMINISTRADOR;
    case '2':
      return RolEnum.ESTUDIANTE;
    case '3':
      return RolEnum.FACULTAD;
    case '4':
      return RolEnum.CLUB;
  }

  return;
}

/** Interface to ensure that the object has an `id` property of type number, this is useful for functions that need to generate a new ID based on existing IDs */
interface Identifiable {
  id: number;
}

/**
 * Generates a new ID based on the maximum ID found in the provided source.
 * @param idSource Source of IDs, typically an Observable that emits an array of items with an `id` property,
 * it would be commonly the result of a service function that returns an Observable of an array of a certain type of items
 * @returns The top id + 1, or undefined if the source is empty or not provided
 */
export function generateNewId<T extends Identifiable>( idSource: Observable<T[]> | Observable<object[]> ): number {
  if ( idSource ) {
    let newId: number = 0;

    ( idSource as Observable<T[]> ).subscribe( ( items: T[] ) => {
      if( items ){
        let topId = 0;

        items.forEach( item => {
          if( item.id > topId )
            topId = item.id;
        });

        newId = topId + 1;
        return;
      }

      return;
    });

    return newId;
  }

  return 0;
}
