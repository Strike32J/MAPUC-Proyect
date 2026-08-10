import { crearDataSourceMigraciones } from '../libs/database';

async function revertir(): Promise<void> {
  const fuenteDatos = crearDataSourceMigraciones();
  await fuenteDatos.initialize();
  await fuenteDatos.undoLastMigration({ transaction: 'all' });
  await fuenteDatos.destroy();
}

void revertir();
