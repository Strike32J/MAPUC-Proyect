import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { Entorno } from './environment.schema';

export function crearConfiguracionBaseDatos(
  entorno: Entorno,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: entorno.DATABASE_URL,
    synchronize: false,
    migrationsRun: false,
    logging: entorno.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    extra: {
      min: entorno.DATABASE_POOL_MIN,
      max: entorno.DATABASE_POOL_MAX,
    },
    ssl: entorno.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : false,
  };
}
