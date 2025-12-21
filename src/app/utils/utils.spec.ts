import { of } from 'rxjs';
import { TimeAgoPipe } from './time-ago.pipe';
import { generateNewId, getRolEnumByStrId, getRolEnumKeyNameByStrId, getUserName, onImageError, RolEnum } from './utils';

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
    expect( getRolEnumByStrId( '5' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '7' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '0' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '-1' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '-3' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '-7' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '' ) ).toBeUndefined();
    expect( getRolEnumByStrId( 'hola' ) ).toBeUndefined();
  });

  it( 'should return the corresponding enum constant or undefined by an string index', () => {
    expect( getRolEnumByStrId( '1' ) ).toBe( RolEnum.ADMINISTRADOR );
    expect( getRolEnumByStrId( '2' ) ).toBe( RolEnum.ESTUDIANTE );
    expect( getRolEnumByStrId( '3' ) ).toBe( RolEnum.FACULTAD );
    expect( getRolEnumByStrId( '4' ) ).toBe( RolEnum.CLUB );
    expect( getRolEnumByStrId( '5' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '7' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '0' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '-1' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '-3' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '-7' ) ).toBeUndefined();
    expect( getRolEnumByStrId( '' ) ).toBeUndefined();
    expect( getRolEnumByStrId( 'hola' ) ).toBeUndefined();
  });

  it( 'should return top id in the observable array + 1 as a new id', () => {
    const mockData1 = [{ id: 1 }, { id: 4 }, { id: 6 }];
    const mockData2 = [{ id: 5 }, { id: 3 }, { id: 7 }, { id: 10 }, { id: 12 }, { id: 11 }, { id: 13 }, { id: 15 }];
    const mockData3 = [{ id: 1 }, { id: 4 }, { id: 7 }, { id: 2 }, { id: 5 }, { id: 3 }];
    const mockData4: object[] = [];

    const source1$ = of( mockData1 ); // Se crea un observable que emite el mockData
    const source2$ = of( mockData2 );
    const source3$ = of( mockData3 );
    const source4$ = of( mockData4 );

    const result1 = generateNewId( source1$ );
    const result2 = generateNewId( source2$ );
    const result3 = generateNewId( source3$ );
    const result4 = generateNewId( source4$ );

    expect( result1 ).toBe( 7 );
    expect( result2 ).toBe( 16 );
    expect( result3 ).toBe( 8 );
    expect( result4 ).toBe( 1 );
  });
});
