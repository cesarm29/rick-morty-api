# Rick and Morty GraphQL API

Project scaffolding for an Express + GraphQL API that serves Rick and Morty characters stored in a relational database (Postgres) with Redis caching.

Quick start:

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `REDIS_URL`.
2. Install dependencies:

```bash
npm install
```

3. Run migrations (requires `sequelize-cli` and built JS):

```bash
npm run build
npx sequelize db:migrate --config dist/config/config.js
```

4. Seed database with 15 characters:

```bash
npm run seed
```

5. Start dev server:

```bash
npm run dev
```

API: GraphQL endpoint at `/graphql` supports `characters(filter, limit, offset)` and `character(id)`.

Redis — Configuración rápida

- Si ya tienes Redis instalado localmente: inicia el servidor con `redis-server` o el servicio correspondiente.
- Usando Docker (recomendado si no quieres instalar Redis localmente):

```bash
docker run -d --name rickmorty-redis -p 6379:6379 redis:7
```

- Si usas Docker Compose y tu `docker-compose.yml` incluye un servicio `redis`, levántalo con:

```bash
docker compose up -d redis
```

- Nota (Windows): ejecuta Redis en WSL2 o usando Docker Desktop. El cliente de la app espera una URL tipo `redis://host:6379`.

Inicialización paso a paso (Spanish)

1. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
# En Windows (PowerShell): Copy-Item .env.example .env
```

2. Edita `.env` y establece al menos `DATABASE_URL` y `REDIS_URL` (ejemplo):

```
DATABASE_URL=postgres://user:pass@localhost:5432/rickmorty
REDIS_URL=redis://localhost:6379
```

3. Instala dependencias:

```bash
npm install
```

4. Levanta Redis (elige una opción):

- Usando Docker: `docker run -d --name rickmorty-redis -p 6379:6379 redis:7`
- Usando Docker Compose: `docker compose up -d redis`
- O inicia tu servicio `redis-server` localmente.

5. Construye el proyecto (genera `dist`):

```bash
npm run build
```

6. Ejecuta migraciones (requiere que `dist` exista):

```bash
npx sequelize db:migrate --config dist/config/config.js
```

7. Si es la primera vez, carga datos de prueba:

```bash
npm run seed
```

8. Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

9. Verifica la API GraphQL en `http://localhost:4000/graphql` (o el puerto configurado) y prueba las consultas `characters` y `character`.

Si necesitas ayuda para elegir entre instalar Redis localmente o usar Docker, dime tu entorno (Windows / WSL / Linux / Mac) y te doy el comando exacto.
