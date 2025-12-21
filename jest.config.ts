import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/cypress/', 'node_modules/(?!@angular|rxjs)'],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/?(*.)+(spec).ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@angular|@ngrx|rxjs)'
  ],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@environments/(.*)$': '<rootDir>/src/environments/$1'
  },
  // --- Configuración de cobertura ---
  collectCoverage: true,
  collectCoverageFrom: [
    "src/app/**/*.ts",              // Archivos a incluir
    "!src/main.ts",                  // Archivos a excluir
    "!src/environments/**",          // Exclusiones típicas
    "!src/app/**/*.spec.ts"          // No incluir pruebas en la cobertura
  ],
  coverageDirectory: "coverage",     // Carpeta de salida
  coverageReporters: [
    "html",      // Reporte visual (abrir en navegador)
    "text",      // Resumen en consola
    "lcov",      // Formato compatible con CI/CD
    "text-summary"
  ],
};

export default config;
