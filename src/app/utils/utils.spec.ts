import { TimeAgoPipe } from './time-ago.pipe';
import { getRolEnumByStrId, getRolEnumKeyNameByStrId, getUserName, onImageError, RolEnum } from './utils';

describe( 'TimeAgoPipe', () => {
  const timeAgoPipe = new TimeAgoPipe();

  it( 'TimeAgoPipe should be created', () => {
    expect( timeAgoPipe ).toBeTruthy();
  });

  it( 'should get the string with the time ago since the date string parameter containing the word hace', () => {
    expect( timeAgoPipe.transform( '2025-05-21T21:19:03.512Z') ).toContain( 'hace' );
  });
});

describe( 'UtilsFunctions', () => {
  it( 'fallback image on img element should be shown', () => {
    const imgElement = document.createElement( 'img' );
    onImageError( imgElement );
    expect( imgElement.src ).toContain( '/images/no-image-found-design.webp' );
  });

  it( 'should return the first name of the logged-in user', () => {
    expect( getUserName( 'Clark' ) ).toBe( 'Clark' );
    expect( getUserName( 'Rudeus' ) ).toBe( 'Rudeus' );
    expect( getUserName( 'Eris' ) ).toBe( 'Eris' );
  });

  it( 'should return the first and the second name of the logged-in user', () => {
    expect( getUserName( 'Clark KalEl' ) ).toBe( 'Clark KalEl' );
    expect( getUserName( 'Clark KalEl Boreas Kent' ) ).toBe( 'Clark KalEl' );
    expect( getUserName( 'Clark Joseph Kent' ) ).toBe( 'Clark Joseph' );
    expect( getUserName( 'Elinalise Roxelina' ) ).toBe( 'Elinalise Roxelina' );
    expect( getUserName( 'Rudeus Greyrat' ) ).toBe( 'Rudeus Greyrat' );
    expect( getUserName( 'Eris Boreas Greyrat' ) ).toBe( 'Eris Boreas' );
  });

  it( 'should return the corresponding enum constant name string or undefined by an string index', () => {
    expect( getRolEnumKeyNameByStrId( '1' ) ).toBe( 'ADMINISTRADOR' );
    expect( getRolEnumKeyNameByStrId( '2' ) ).toBe( 'ESTUDIANTE' );
    expect( getRolEnumKeyNameByStrId( '3' ) ).toBe( 'FACULTAD' );
    expect( getRolEnumKeyNameByStrId( '4' ) ).toBe( 'CLUB' );
    expect( getRolEnumByStrId( '5' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '7' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '0' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '-1' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '-3' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '-7' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '' ) ).toBe( undefined );
    expect( getRolEnumByStrId( 'hola' ) ).toBe( undefined );
  });

  it( 'should return the corresponding enum constant or undefined by an string index', () => {
    expect( getRolEnumByStrId( '1' ) ).toBe( RolEnum.ADMINISTRADOR );
    expect( getRolEnumByStrId( '2' ) ).toBe( RolEnum.ESTUDIANTE );
    expect( getRolEnumByStrId( '3' ) ).toBe( RolEnum.FACULTAD );
    expect( getRolEnumByStrId( '4' ) ).toBe( RolEnum.CLUB );
    expect( getRolEnumByStrId( '5' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '7' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '0' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '-1' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '-3' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '-7' ) ).toBe( undefined );
    expect( getRolEnumByStrId( '' ) ).toBe( undefined );
    expect( getRolEnumByStrId( 'hola' ) ).toBe( undefined );
  });
});
