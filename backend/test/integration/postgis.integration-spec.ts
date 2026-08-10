import { crearDataSourceMigraciones } from '../../libs/database';

const ejecutarIntegracion = process.env.DATABASE_URL ? describe : describe.skip;

ejecutarIntegracion('PostgreSQL con PostGIS', () => {
  it('tiene la extension y la tabla de outbox despues de las migraciones', async () => {
    const fuenteDatos = crearDataSourceMigraciones();
    await fuenteDatos.initialize();
    await fuenteDatos.runMigrations({ transaction: 'all' });

    const extensiones = await fuenteDatos.query<{ extname: string }[]>(
      "SELECT extname FROM pg_extension WHERE extname = 'postgis'",
    );
    const tablas = await fuenteDatos.query<{ table_name: string }[]>(
      "SELECT table_name FROM information_schema.tables WHERE table_name = 'eventos_outbox'",
    );

    expect(extensiones).toHaveLength(1);
    expect(tablas).toHaveLength(1);
    await fuenteDatos.destroy();
  });
});
