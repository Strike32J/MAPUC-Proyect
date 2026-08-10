import { DataSource } from 'typeorm';
import { MigracionInicial1736380800000 } from './migrations/1736380800000-migracion-inicial';

export function crearDataSourceMigraciones(): DataSource {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL es obligatoria para ejecutar migraciones.');
  }

  return new DataSource({
    type: 'postgres',
    url,
    ssl:
      process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: true }
        : false,
    synchronize: false,
    migrations: [MigracionInicial1736380800000],
  });
}
