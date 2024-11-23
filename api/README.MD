# API REST para gestión de pedidos

Este proyecto es una API REST construida con **Fastify** y **Knex.js** que permite gestionar productos, clientes, pedidos y usuarios con autenticación basada en JWT.

## Características

- Gestión de usuarios, productos, clientes y pedidos.
- Autenticación mediante JWT.
- Uso de **Fastify** para manejar rutas y plugins.
- SQLite como base de datos con **Knex.js** como query builder.

## Requisitos

- Node.js v16+
- npm v8+

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url_del_repositorio>
   cd nombre-del-repositorio
   ```
2. Instala las dependcias

```npm install

```

3. Configura las variables de entorno: Crea un archivo .env en la raíz con el siguiente contenido:

```JWT_SECRET=tu_secreto_jwt

```

4.Ejecuta las migraciones (Estas son las estrctura de la base de datos, lee el fichero dev.db):

```npx knex migrate:latest

```

## Uso

Arrancar el servidor
Para iniciar la aplicación Por ahora estamos en fase de desarrollo

```npm run dev

```

El servidor estará disponible en http://localhost:3000.

## Endpoints principales

Método Ruta Descripción
POST /auth Autenticación de usuarios
GET /producto Obtener todos los productos
GET /cliente Obtener todos los clientes
GET /pedido Obtener todos los pedidos

# Notas adicionales

Para acceder a las rutas protegidas, necesitas un token JWT. Inclúyelo en el encabezado Authorization como Bearer <token>.

es todo por el momento :D
