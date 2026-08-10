import { crearDataSourceMigraciones } from '../libs/database';

async function ejecutar(): Promise<void> {
  const fuenteDatos = crearDataSourceMigraciones();
  await fuenteDatos.initialize();
  await fuenteDatos.runMigrations({ transaction: 'all' });
  await fuenteDatos.destroy();
}

void ejecutar();
