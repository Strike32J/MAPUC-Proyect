import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MigracionInicial1736380800000 implements MigrationInterface {
  name = 'MigracionInicial1736380800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS postgis;
      CREATE EXTENSION IF NOT EXISTS pg_trgm;
      CREATE EXTENSION IF NOT EXISTS unaccent;
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE usuarios (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        sujeto_autenticacion varchar(255) NOT NULL UNIQUE,
        correo varchar(320) NOT NULL UNIQUE,
        nombres varchar(160) NOT NULL,
        apellidos varchar(160) NOT NULL,
        estado varchar(20) NOT NULL CHECK (estado IN ('ACTIVO', 'SUSPENDIDO', 'ELIMINADO')),
        creado_en timestamptz NOT NULL DEFAULT now(),
        actualizado_en timestamptz NOT NULL DEFAULT now(),
        ultimo_acceso_en timestamptz
      );
      CREATE TABLE roles (
        id smallserial PRIMARY KEY,
        codigo varchar(40) NOT NULL UNIQUE,
        nombre varchar(100) NOT NULL,
        descripcion varchar(500)
      );
      INSERT INTO roles (codigo, nombre, descripcion) VALUES
        ('USUARIO', 'Usuario', 'Acceso general a MAPUC'),
        ('MODERADOR', 'Moderador', 'Moderacion de contenido'),
        ('ADMINISTRADOR', 'Administrador', 'Administracion del campus')
      ON CONFLICT (codigo) DO NOTHING;
      CREATE TABLE usuario_roles (
        usuario_id uuid NOT NULL REFERENCES usuarios(id),
        rol_id smallint NOT NULL REFERENCES roles(id),
        asignado_por_id uuid REFERENCES usuarios(id),
        asignado_en timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (usuario_id, rol_id)
      );
      CREATE TABLE preferencias_usuario (
        usuario_id uuid PRIMARY KEY REFERENCES usuarios(id),
        notificar_alertas boolean NOT NULL DEFAULT true,
        notificar_aforo boolean NOT NULL DEFAULT true,
        preferir_rutas_accesibles boolean NOT NULL DEFAULT false,
        apariencia_mapa varchar(30) NOT NULL DEFAULT 'SISTEMA',
        idioma varchar(10) NOT NULL DEFAULT 'es-PE',
        actualizado_en timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE conjuntos_mapa (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre varchar(180) NOT NULL,
        tipo_fuente varchar(20) NOT NULL CHECK (tipo_fuente IN ('CAD', 'GEOJSON', 'ARCGIS', 'OTRO')),
        uri_fuente text NOT NULL,
        version varchar(100) NOT NULL UNIQUE,
        srid integer NOT NULL,
        estado varchar(20) NOT NULL CHECK (estado IN ('CARGADO', 'VALIDANDO', 'RECHAZADO', 'LISTO', 'PUBLICADO', 'RETIRADO')),
        checksum varchar(128) NOT NULL,
        importado_por_id uuid REFERENCES usuarios(id),
        importado_en timestamptz NOT NULL DEFAULT now(),
        publicado_en timestamptz
      );
      CREATE TABLE campus (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        conjunto_mapa_id uuid REFERENCES conjuntos_mapa(id),
        codigo varchar(50) NOT NULL UNIQUE,
        nombre varchar(180) NOT NULL,
        direccion varchar(320),
        limite geometry(GEOMETRY),
        activo boolean NOT NULL DEFAULT true,
        actualizado_en timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE edificios (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        campus_id uuid NOT NULL REFERENCES campus(id),
        conjunto_mapa_id uuid REFERENCES conjuntos_mapa(id),
        codigo varchar(50) NOT NULL UNIQUE,
        nombre varchar(180) NOT NULL,
        geometria geometry(GEOMETRY),
        accesible boolean NOT NULL DEFAULT false,
        activo boolean NOT NULL DEFAULT true,
        actualizado_en timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE pisos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        edificio_id uuid NOT NULL REFERENCES edificios(id),
        conjunto_mapa_id uuid REFERENCES conjuntos_mapa(id),
        numero_nivel integer NOT NULL,
        nombre varchar(100) NOT NULL,
        geometria geometry(GEOMETRY),
        activo boolean NOT NULL DEFAULT true,
        UNIQUE (edificio_id, numero_nivel)
      );
      CREATE TABLE categorias (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        categoria_padre_id uuid REFERENCES categorias(id),
        codigo varchar(80) NOT NULL UNIQUE,
        nombre varchar(120) NOT NULL,
        icono varchar(100),
        color varchar(20),
        activa boolean NOT NULL DEFAULT true
      );
      CREATE TABLE lugares (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        campus_id uuid NOT NULL REFERENCES campus(id),
        edificio_id uuid REFERENCES edificios(id),
        piso_id uuid REFERENCES pisos(id),
        categoria_id uuid NOT NULL REFERENCES categorias(id),
        conjunto_mapa_id uuid REFERENCES conjuntos_mapa(id),
        codigo varchar(80) NOT NULL UNIQUE,
        nombre varchar(180) NOT NULL,
        descripcion text,
        capacidad_estimada integer CHECK (capacidad_estimada >= 0),
        geometria geometry(GEOMETRY),
        punto_etiqueta geometry(GEOMETRY),
        accesible boolean NOT NULL DEFAULT false,
        activo boolean NOT NULL DEFAULT true,
        actualizado_en timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE horarios_lugar (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lugar_id uuid NOT NULL REFERENCES lugares(id),
        dia_semana smallint NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
        abre_a time,
        cierra_a time,
        cerrado boolean NOT NULL DEFAULT false,
        valido_desde date,
        valido_hasta date,
        CHECK (cerrado OR (abre_a IS NOT NULL AND cierra_a IS NOT NULL))
      );
      CREATE TABLE servicios (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo varchar(80) NOT NULL UNIQUE,
        nombre varchar(120) NOT NULL,
        icono varchar(100),
        activo boolean NOT NULL DEFAULT true
      );
      CREATE TABLE lugar_servicios (
        lugar_id uuid NOT NULL REFERENCES lugares(id),
        servicio_id uuid NOT NULL REFERENCES servicios(id),
        detalle varchar(500),
        PRIMARY KEY (lugar_id, servicio_id)
      );
      CREATE TABLE nodos_ruta (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        campus_id uuid NOT NULL REFERENCES campus(id),
        edificio_id uuid REFERENCES edificios(id),
        piso_id uuid REFERENCES pisos(id),
        tipo varchar(40) NOT NULL,
        ubicacion geometry(GEOMETRY) NOT NULL,
        accesible boolean NOT NULL DEFAULT false,
        activo boolean NOT NULL DEFAULT true
      );
      CREATE TABLE tramos_ruta (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        nodo_origen_id uuid NOT NULL REFERENCES nodos_ruta(id),
        nodo_destino_id uuid NOT NULL REFERENCES nodos_ruta(id),
        tipo varchar(40) NOT NULL,
        geometria geometry(GEOMETRY) NOT NULL,
        distancia_metros numeric(10,2) NOT NULL CHECK (distancia_metros >= 0),
        duracion_segundos integer NOT NULL CHECK (duracion_segundos >= 0),
        pendiente numeric(6,3),
        accesible boolean NOT NULL DEFAULT false,
        bidireccional boolean NOT NULL DEFAULT true,
        activo boolean NOT NULL DEFAULT true
      );

      CREATE TABLE estados_aforo (
        lugar_id uuid PRIMARY KEY REFERENCES lugares(id),
        nivel varchar(30) NOT NULL CHECK (nivel IN ('VACIO', 'POCO', 'MEDIO', 'ALTO', 'LLENO', 'SIN_INFORMACION')),
        cantidad_estimada integer CHECK (cantidad_estimada >= 0),
        tipo_fuente varchar(20) NOT NULL CHECK (tipo_fuente IN ('SENSOR', 'OFICIAL', 'COMUNIDAD', 'ESTIMACION')),
        referencia_fuente varchar(255),
        confianza numeric(4,3) CHECK (confianza BETWEEN 0 AND 1),
        observado_en timestamptz NOT NULL,
        actualizado_en timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE lecturas_aforo (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lugar_id uuid NOT NULL REFERENCES lugares(id),
        nivel varchar(30) NOT NULL CHECK (nivel IN ('VACIO', 'POCO', 'MEDIO', 'ALTO', 'LLENO', 'SIN_INFORMACION')),
        cantidad_estimada integer CHECK (cantidad_estimada >= 0),
        tipo_fuente varchar(20) NOT NULL CHECK (tipo_fuente IN ('SENSOR', 'OFICIAL', 'COMUNIDAD', 'ESTIMACION')),
        referencia_fuente varchar(255),
        confianza numeric(4,3) CHECK (confianza BETWEEN 0 AND 1),
        observado_en timestamptz NOT NULL
      );
      CREATE TABLE salas_chat (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lugar_id uuid NOT NULL REFERENCES lugares(id),
        motivo_apertura varchar(40) NOT NULL,
        estado varchar(20) NOT NULL CHECK (estado IN ('PROGRAMADA', 'ABIERTA', 'SUSPENDIDA', 'CERRADA')),
        maximo_caracteres integer NOT NULL DEFAULT 300 CHECK (maximo_caracteres BETWEEN 1 AND 300),
        mensajes_por_ventana integer NOT NULL DEFAULT 5 CHECK (mensajes_por_ventana > 0),
        segundos_ventana integer NOT NULL DEFAULT 60 CHECK (segundos_ventana > 0),
        abierta_en timestamptz,
        cierra_en timestamptz,
        cerrada_en timestamptz,
        CHECK (estado <> 'ABIERTA' OR (abierta_en IS NOT NULL AND cierra_en IS NOT NULL))
      );
      CREATE TABLE mensajes_chat (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        sala_id uuid NOT NULL REFERENCES salas_chat(id),
        usuario_id uuid NOT NULL REFERENCES usuarios(id),
        contenido varchar(300) NOT NULL CHECK (char_length(contenido) BETWEEN 1 AND 300),
        estado_moderacion varchar(20) NOT NULL CHECK (estado_moderacion IN ('VISIBLE', 'REPORTADO', 'OCULTO', 'ELIMINADO')),
        creado_en timestamptz NOT NULL DEFAULT now(),
        ocultado_en timestamptz,
        expira_en timestamptz
      );
      CREATE TABLE reportes_mensaje (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        mensaje_id uuid NOT NULL REFERENCES mensajes_chat(id),
        usuario_id uuid NOT NULL REFERENCES usuarios(id),
        motivo varchar(500) NOT NULL,
        estado varchar(20) NOT NULL DEFAULT 'RECIBIDO',
        creado_en timestamptz NOT NULL DEFAULT now(),
        resuelto_en timestamptz
      );
      CREATE TABLE reportes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lugar_id uuid NOT NULL REFERENCES lugares(id),
        usuario_id uuid NOT NULL REFERENCES usuarios(id),
        tipo varchar(40) NOT NULL,
        descripcion varchar(2000) NOT NULL,
        severidad varchar(20) NOT NULL,
        estado varchar(20) NOT NULL CHECK (estado IN ('RECIBIDO', 'EN_REVISION', 'VALIDADO', 'RECHAZADO', 'RESUELTO')),
        clave_idempotencia varchar(255) NOT NULL UNIQUE,
        resuelto_por_id uuid REFERENCES usuarios(id),
        creado_en timestamptz NOT NULL DEFAULT now(),
        resuelto_en timestamptz
      );
      CREATE TABLE evidencias_reporte (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reporte_id uuid NOT NULL REFERENCES reportes(id),
        uri_archivo text NOT NULL,
        tipo_mime varchar(100) NOT NULL,
        checksum varchar(128) NOT NULL,
        creada_en timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE alertas (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lugar_id uuid REFERENCES lugares(id),
        reporte_origen_id uuid REFERENCES reportes(id),
        creada_por_id uuid NOT NULL REFERENCES usuarios(id),
        tipo varchar(40) NOT NULL,
        titulo varchar(200) NOT NULL,
        descripcion varchar(2000) NOT NULL,
        severidad varchar(20) NOT NULL,
        fuente varchar(30) NOT NULL CHECK (fuente IN ('OFICIAL', 'COMUNIDAD_VALIDADA')),
        estado varchar(20) NOT NULL CHECK (estado IN ('BORRADOR', 'PROGRAMADA', 'ACTIVA', 'FINALIZADA', 'CANCELADA')),
        inicia_en timestamptz NOT NULL,
        termina_en timestamptz,
        creada_en timestamptz NOT NULL DEFAULT now(),
        publicada_en timestamptz,
        CHECK (termina_en IS NULL OR termina_en > inicia_en),
        CHECK (fuente <> 'COMUNIDAD_VALIDADA' OR reporte_origen_id IS NOT NULL)
      );

      CREATE TABLE lugares_guardados (
        usuario_id uuid NOT NULL REFERENCES usuarios(id),
        lugar_id uuid NOT NULL REFERENCES lugares(id),
        guardado_en timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (usuario_id, lugar_id)
      );
      CREATE TABLE actividad_lugares (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id uuid NOT NULL REFERENCES usuarios(id),
        lugar_id uuid NOT NULL REFERENCES lugares(id),
        tipo_actividad varchar(30) NOT NULL CHECK (tipo_actividad IN ('VISTO', 'RUTA_INICIADA', 'VISITADO')),
        ocurrido_en timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE busquedas_recientes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id uuid NOT NULL REFERENCES usuarios(id),
        texto varchar(200) NOT NULL,
        filtros jsonb NOT NULL DEFAULT '{}'::jsonb,
        buscado_en timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE notificaciones (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id uuid NOT NULL REFERENCES usuarios(id),
        lugar_id uuid REFERENCES lugares(id),
        alerta_id uuid REFERENCES alertas(id),
        reporte_id uuid REFERENCES reportes(id),
        tipo varchar(40) NOT NULL,
        titulo varchar(200) NOT NULL,
        contenido varchar(2000) NOT NULL,
        leida boolean NOT NULL DEFAULT false,
        creada_en timestamptz NOT NULL DEFAULT now(),
        leida_en timestamptz,
        expira_en timestamptz
      );
      CREATE TABLE auditorias (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_usuario_id uuid REFERENCES usuarios(id),
        accion varchar(100) NOT NULL,
        tipo_recurso varchar(100) NOT NULL,
        recurso_id varchar(100) NOT NULL,
        datos_anteriores jsonb,
        datos_nuevos jsonb,
        direccion_ip_hash varchar(128),
        creado_en timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE eventos_outbox (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        agregado_tipo varchar(100) NOT NULL,
        agregado_id varchar(100) NOT NULL,
        evento_tipo varchar(150) NOT NULL,
        version_evento integer NOT NULL CHECK (version_evento > 0),
        correlation_id varchar(128) NOT NULL,
        contenido jsonb NOT NULL,
        creado_en timestamptz NOT NULL DEFAULT now(),
        publicado_en timestamptz,
        intentos integer NOT NULL DEFAULT 0 CHECK (intentos >= 0)
      );

      CREATE INDEX idx_campus_limite_gist ON campus USING GIST (limite);
      CREATE INDEX idx_edificios_geometria_gist ON edificios USING GIST (geometria);
      CREATE INDEX idx_lugares_geometria_gist ON lugares USING GIST (geometria);
      CREATE INDEX idx_nodos_ruta_ubicacion_gist ON nodos_ruta USING GIST (ubicacion);
      CREATE INDEX idx_tramos_ruta_geometria_gist ON tramos_ruta USING GIST (geometria);
      CREATE INDEX idx_lugares_nombre_trgm ON lugares USING GIN (nombre gin_trgm_ops);
      CREATE INDEX idx_lugares_categoria_activo ON lugares (categoria_id, activo);
      CREATE INDEX idx_lugares_edificio_piso ON lugares (edificio_id, piso_id);
      CREATE INDEX idx_lecturas_aforo_lugar_fecha ON lecturas_aforo (lugar_id, observado_en DESC);
      CREATE INDEX idx_mensajes_chat_sala_fecha ON mensajes_chat (sala_id, creado_en DESC);
      CREATE INDEX idx_reportes_estado_fecha ON reportes (estado, creado_en DESC);
      CREATE INDEX idx_alertas_estado_periodo ON alertas (estado, inicia_en, termina_en);
      CREATE INDEX idx_notificaciones_usuario_no_leida ON notificaciones (usuario_id, creada_en DESC) WHERE leida = FALSE;
      CREATE INDEX idx_eventos_outbox_pendientes ON eventos_outbox (creado_en) WHERE publicado_en IS NULL;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS eventos_outbox, auditorias, notificaciones, busquedas_recientes,
      actividad_lugares, lugares_guardados, alertas, evidencias_reporte, reportes,
      reportes_mensaje, mensajes_chat, salas_chat, lecturas_aforo, estados_aforo,
      tramos_ruta, nodos_ruta, lugar_servicios, servicios, horarios_lugar, lugares,
      categorias, pisos, edificios, campus, conjuntos_mapa, preferencias_usuario,
      usuario_roles, roles, usuarios CASCADE;
    `);
  }
}
