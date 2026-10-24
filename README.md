# AnyList GraphQL API

API **GraphQL** para gestionar **listas de compras** construida con **NestJS**, **Apollo Server** y **TypeORM** sobre **PostgreSQL**. Cada usuario se registra, inicia sesión con **JWT**, crea su propio catálogo de artículos (_items_) y los agrupa en listas con cantidad y estado de completado. Incluye **control de acceso por roles**, paginación y búsqueda en todas las consultas, y un _seed_ para poblar la base de datos en desarrollo.

![Tech](https://img.shields.io/badge/NestJS-10-E0234E)
![Tech](https://img.shields.io/badge/GraphQL-Apollo-311C87)
![Tech](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tech](https://img.shields.io/badge/PostgreSQL-14.4-4169E1)
![Tech](https://img.shields.io/badge/TypeORM-0.3-FE0803)
![Tech](https://img.shields.io/badge/Auth-JWT%20%2B%20Passport-000000)
![Tech](https://img.shields.io/badge/Docker-Compose-2496ED)

---

## Tabla de contenidos

- [AnyList GraphQL API](#anylist-graphql-api)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos](#requisitos)
    - [Instalación](#instalación)
    - [Variables de entorno](#variables-de-entorno)
    - [Base de datos con Docker](#base-de-datos-con-docker)
    - [Levantar la API](#levantar-la-api)
    - [Poblar la base de datos (seed)](#poblar-la-base-de-datos-seed)
    - [Scripts disponibles](#scripts-disponibles)
  - [Queries y mutations](#queries-y-mutations)
    - [Autenticación](#autenticación)
    - [Usuarios](#usuarios)
    - [Items](#items)
    - [Listas y elementos de lista](#listas-y-elementos-de-lista)
    - [Ejemplo](#ejemplo)
  - [Cómo funciona](#cómo-funciona)
    - [1. `auth`](#1-auth)
    - [2. `users`](#2-users)
    - [3. `items`](#3-items)
    - [4. `lists` y `list-item`](#4-lists-y-list-item)
    - [5. `seed`](#5-seed)
    - [6. `common` y `shared`](#6-common-y-shared)
    - [Flujo de una petición](#flujo-de-una-petición)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **Registro e inicio de sesión** (`signUp`, `login`) con contraseñas cifradas con **bcrypt** y respuesta `{ token, user }`.
- **Autenticación JWT** (Bearer token) protegiendo todos los resolvers excepto registro, login y seed.
- **Roles** (`admin`, `user`, `super_user`) validados en el propio decorador `@CurrentUser([...roles])`.
- **Items**: catálogo propio de cada usuario (nombre y unidad de medida), aislado por `userId`.
- **Listas**: cada usuario crea listas y les añade items con `quantity` y `completed`.
- **Campos resueltos** (`@ResolveField`): `List.items`, `List.totalItems`, y para administradores `User.items`, `User.itemCount`, `User.list`, `User.listCount`.
- **Paginación** (`offset`, `limit`) y **búsqueda** (`search`, sin distinguir mayúsculas) reutilizables en todas las consultas de colección.
- **Gestión de usuarios** para administradores: listar filtrando por roles, consultar, actualizar y bloquear (`isActive = false`), registrando quién hizo el último cambio (`lastUpdateBy`).
- **Seed** que borra y repuebla la base de datos con usuarios, items y una lista de ejemplo (bloqueado cuando `STATE=prod`).
- **Esquema generado automáticamente** (_code-first_) en `src/schema.gql` y **Apollo Sandbox** como interfaz para explorar la API.

---

## Cómo ejecutar el proyecto

### Requisitos

- **Node.js** y **npm**
- **Docker** y **Docker Compose** (para PostgreSQL), o una instancia de PostgreSQL propia

### Instalación

```bash
npm install
```

### Variables de entorno

Copia la plantilla y rellena los valores:

```bash
cp .env.example .env
```

```env
STATE=dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=AnyListDB
DB_USER_NAME=postgres
DB_PASSWORD=<tu_password>
JWT_SECRET=<tu_secreto>
JWT_EXPIRATION_TIME=1h
```

> Al arrancar, `ConfigModule` valida el entorno con el esquema Joi de `src/common/config/joi.schema-validation.ts`: `DB_PASSWORD`, `DB_NAME` y `JWT_SECRET` son obligatorias (la app no arranca si faltan) y el resto toma su valor por defecto (`STATE=dev`, `DB_HOST=localhost`, `DB_PORT=5432`, `DB_USER_NAME=postgres`, `JWT_EXPIRATION_TIME=4h`).

### Base de datos con Docker

`docker-compose.yml` levanta **PostgreSQL 14.4** en el puerto `5432` usando `DB_PASSWORD` y `DB_NAME` del `.env`, y persiste los datos en `./postgres`:

```bash
docker-compose up -d
```

TypeORM está configurado con `synchronize: true`, por lo que las tablas se crean automáticamente al arrancar.

### Levantar la API

```bash
npm run start:dev
```

La API escucha en el puerto **4000**. Abre `http://localhost:4000/graphql` para usar Apollo Sandbox.

### Poblar la base de datos (seed)

Con `STATE` distinto de `prod`, ejecuta la mutation:

```graphql
mutation {
  executeSeed
}
```

Borra todas las tablas y crea los usuarios, items y listas definidos en `src/core/seed/data/seed-data.ts` (ahí están también las credenciales de prueba).

### Scripts disponibles

| Script                | Descripción                         |
| --------------------- | ----------------------------------- |
| `npm run start`       | Arranca la aplicación               |
| `npm run start:dev`   | Modo desarrollo con _watch_         |
| `npm run start:debug` | Modo depuración con _watch_         |
| `npm run build`       | Compila a `dist/`                   |
| `npm run start:prod`  | Ejecuta la build (`node dist/main`) |
| `npm run lint`        | ESLint con autocorrección           |
| `npm run format`      | Prettier sobre `src/` y `test/`     |
| `npm run test`        | Tests unitarios (Jest)              |
| `npm run test:e2e`    | Tests end-to-end                    |
| `npm run test:cov`    | Cobertura de tests                  |

---

## Queries y mutations

Todas las operaciones salvo `signUp`, `login` y `executeSeed` requieren la cabecera `Authorization: Bearer <token>`.

### Autenticación

| Operación         | Tipo     | Descripción                                          | Rol requerido                 |
| ----------------- | -------- | ---------------------------------------------------- | ----------------------------- |
| `signUp`          | Mutation | Crea un usuario y devuelve `{ token, user }`         | —                             |
| `login`           | Mutation | Valida email/contraseña y devuelve `{ token, user }` | —                             |
| `revalidateToken` | Query    | Emite un token nuevo para el usuario autenticado     | Cualquier usuario autenticado |

### Usuarios

| Operación      | Tipo     | Descripción                                               | Rol requerido          |
| -------------- | -------- | --------------------------------------------------------- | ---------------------- |
| `findAllUsers` | Query    | Lista usuarios; filtra por `roles`, paginación y búsqueda | `admin`                |
| `findOneUser`  | Query    | Obtiene un usuario por `id`                               | `admin` o `super_user` |
| `updateUser`   | Mutation | Actualiza datos, roles o `isActive`                       | `admin` o `super_user` |
| `blockUser`    | Mutation | Desactiva un usuario                                      | `admin` o `super_user` |

### Items

| Operación    | Tipo     | Descripción                                     |
| ------------ | -------- | ----------------------------------------------- |
| `items`      | Query    | Items del usuario (`offset`, `limit`, `search`) |
| `item`       | Query    | Un item del usuario por `id`                    |
| `createItem` | Mutation | Crea un item (`name`, `quantityUnits`)          |
| `updateItem` | Mutation | Actualiza un item propio                        |
| `removeItem` | Mutation | Elimina un item propio                          |

### Listas y elementos de lista

| Operación        | Tipo     | Descripción                                                                                                             |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `lists`          | Query    | Listas del usuario (`offset`, `limit`, `search`)                                                                        |
| `list`           | Query    | Una lista por `id`, con los campos `items` y `totalItems`                                                               |
| `createList`     | Mutation | Crea una lista                                                                                                          |
| `updateList`     | Mutation | Renombra una lista                                                                                                      |
| `removeList`     | Mutation | Elimina una lista                                                                                                       |
| `listItem`       | Query    | Un elemento de lista por `id`                                                                                           |
| `createListItem` | Mutation | Añade un item a una lista (`listId`, `itemId`, `quantity`, `completed`)                                                 |
| `updateListItem` | Mutation | Actualiza un elemento de lista por `id`; solo cambian los campos enviados (`quantity`, `completed`, `listId`, `itemId`) |

### Ejemplo

```graphql
query {
  lists(limit: 5) {
    id
    name
    totalItems
    items(search: "milk") {
      quantity
      completed
      item {
        name
        quantityUnits
      }
    }
  }
}
```

---

## Cómo funciona

La aplicación se compone en `src/app.module.ts`, que configura `TypeOrmModule` (PostgreSQL, `autoLoadEntities`, `synchronize`) y `GraphQLModule` con `ApolloDriver` en modo _code-first_ (`autoSchemaFile: src/schema.gql`) y el plugin `ApolloServerPluginLandingPageLocalDefault`. `src/main.ts` usa un `CustomLoggerService`, habilita CORS, registra un `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`) y escucha en el puerto `4000`.

### 1. `auth`

- `AuthResolver` expone `signUp`, `login` y `revalidateToken`.
- `AuthService` crea el usuario a través de `UsersService`, compara contraseñas con `bcrypt.compare` y firma el token con `JwtService` (payload `{ id }`).
- `JwtStrategy` (Passport) extrae el Bearer token, lo verifica con `JWT_SECRET` y llama a `AuthService.validateUser`, que rechaza usuarios inactivos.
- `JwtAuthGuard` extiende `AuthGuard('jwt')` y sobrescribe `getRequest` para obtener la request desde `GqlExecutionContext`.
- `@CurrentUser(roles?)` devuelve el usuario de la request y, si se le pasan roles, lanza `ForbiddenException` cuando el usuario no tiene ninguno de ellos.

### 2. `users`

- Entidad `User`: `fullName`, `email` único, `password` (no expuesto en GraphQL), `roles` (array de texto, por defecto `['user']`), `isActive` y la auto-relación `lastUpdateBy`.
- `UsersService.findAll` filtra por roles con `ARRAY[roles] && ARRAY[:...roles]`; `update` y `block` asignan `lastUpdateBy`; los errores de clave duplicada (`23505`) se traducen a `BadRequestException`.
- `UsersResolver` añade campos resueltos (`items`, `itemCount`, `list`, `listCount`) restringidos a administradores.

### 3. `items`

- Entidad `Item`: `name`, `quantityUnits` opcional y relación `ManyToOne` con `User` (índice `userId-index`).
- `ItemsService` filtra siempre por el usuario autenticado y construye la búsqueda con `createQueryBuilder` (`LOWER(name) like :name`).

### 4. `lists` y `list-item`

- Entidad `List`: `name` y relación con `User`; entidad `ListItem` (tabla `listItems`): `quantity`, `completed` y relaciones con `List` e `Item`.
- `ListsResolver` resuelve `items` (paginado y con búsqueda por nombre del item mediante `innerJoin`) y `totalItems` a través de `ListItemService`.
- `ListItemService.create` recibe `listId` e `itemId` y crea la relación; `update` usa un `UpdateQueryBuilder` con un único `set()` que solo incluye los campos enviados (`UpdateListItemInput` no hereda los valores por defecto de `CreateListItemInput`) y se expone como la mutation `updateListItem`.

### 5. `seed`

- `SeedResolver.executeSeed` llama a `SeedService.executeSeed`, que lanza `UnauthorizedException` si `STATE === 'prod'`.
- Borra `listItems`, `lists`, `items` y usuarios, y vuelve a crear los datos de `seed-data.ts`; asigna al primer usuario los items y la primera lista, con cantidades y estados aleatorios.

### 6. `common` y `shared`

- `PaginationArgs` (`offset` ≥ 0, `limit` ≥ 1, por defecto 0 y 10) y `SearchArgs` (`search` opcional) se combinan con `@Args()` en todos los resolvers.
- `CustomLoggerService` extiende `ConsoleLogger` y antepone `[CustomLogger]` a los mensajes.

### Flujo de una petición

```
Cliente (Apollo Sandbox / app)
   │  POST /graphql  +  Authorization: Bearer <token>
   ▼
ValidationPipe (class-validator sobre inputs y args)
   ▼
JwtAuthGuard ──► JwtStrategy.validate() ──► AuthService.validateUser()
   ▼                                          (usuario activo → req.user)
@CurrentUser([roles])  → ForbiddenException si falta el rol
   ▼
Resolver (Items / Lists / ListItem / Users)
   ├─ @ResolveField → servicios relacionados (conteos, items de la lista…)
   ▼
Service (filtra por userId, pagina, busca)
   ▼
TypeORM Repository / QueryBuilder ──► PostgreSQL
```

---

## Tecnologías

- **NestJS 10** — módulos, inyección de dependencias, guards y pipes.
- **GraphQL** con **@nestjs/graphql** + **Apollo Server** (`@nestjs/apollo`) en modo _code-first_.
- **TypeORM 0.3** + **PostgreSQL** (`pg`).
- **Passport JWT** + **@nestjs/jwt** para autenticación; **bcrypt** para contraseñas.
- **class-validator** / **class-transformer** para validar inputs.
- **Docker Compose** para la base de datos.
- **Jest** + **Supertest**, **ESLint** y **Prettier**.

---

## Estructura del proyecto

```
anylist-graphql-api/
├── src/
│   ├── main.ts                     # Bootstrap: logger, CORS, ValidationPipe, puerto 4000
│   ├── app.module.ts               # TypeORM + GraphQL (Apollo) + módulos
│   ├── schema.gql                  # Esquema generado automáticamente
│   ├── common/
│   │   ├── config/                 # env.config.ts, joi.schema-validation.ts
│   │   └── dto/args/               # PaginationArgs, SearchArgs
│   ├── core/
│   │   ├── auth/                   # resolver, service, JwtStrategy, JwtAuthGuard, @CurrentUser, roles
│   │   ├── users/                  # entidad User, resolver, service, DTOs
│   │   ├── items/                  # entidad Item, resolver, service, DTOs
│   │   ├── lists/                  # entidad List, resolver, service, DTOs
│   │   ├── list-item/              # entidad ListItem, resolver, service, DTOs
│   │   └── seed/                   # resolver, service y data/seed-data.ts
│   └── shared/config/log/          # CustomLoggerService
├── test/                           # app.e2e-spec.ts, jest-e2e.json
├── docker-compose.yml              # PostgreSQL 14.4
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## Personalización

Variables de entorno leídas por la aplicación:

| Variable              | Significado                                           | Ejemplo / por defecto |
| --------------------- | ----------------------------------------------------- | --------------------- |
| `STATE`               | Entorno; con `prod` se bloquea el seed                | `dev`                 |
| `DB_HOST`             | Host de PostgreSQL                                    | `localhost`           |
| `DB_PORT`             | Puerto de PostgreSQL                                  | `5432`                |
| `DB_NAME`             | Nombre de la base de datos (también usado por Docker) | `AnyListDB`           |
| `DB_USER_NAME`        | Usuario de PostgreSQL                                 | `postgres`            |
| `DB_PASSWORD`         | Contraseña de PostgreSQL (también usada por Docker)   | —                     |
| `JWT_SECRET`          | Secreto para firmar y verificar los tokens            | —                     |
| `JWT_EXPIRATION_TIME` | Caducidad del token                                   | `1h` / `4h`           |

> El puerto `4000` está fijado en `src/main.ts`. `ConfigModule.forRoot` valida estas variables con `JoiValidationSchema` (`src/common/config/joi.schema-validation.ts`), que aplica los valores por defecto, y carga además `EnvConfig` (`src/common/config/env.config.ts`).

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
