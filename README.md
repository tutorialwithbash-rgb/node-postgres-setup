# project-hub-server

## Run with Docker

Start the API and PostgreSQL database with Docker Compose:

```bash
docker compose up --build
```

The API is available at `http://localhost:3001`, the Swagger UI at
`http://localhost:3001/api/v1/docs`, and Prisma Studio at
`http://localhost:5555`. PostgreSQL is available on port `5432`. Studio is
bound to localhost and is intended for local development.
Compose waits for PostgreSQL to become healthy, then applies committed Prisma
migrations before starting the API. Database files persist in the
`postgres_data` volume.

The Compose file has development-only default database credentials. For local
overrides, create a `.env` file in the project root and set `POSTGRES_USER`,
`POSTGRES_PASSWORD`, and `POSTGRES_DB`. Keep `.env` out of version control and
set `DOCS_USERNAME` and `DOCS_PASSWORD` to change the Swagger UI credentials.
The development defaults are not secure for public deployments.

Stop the containers with `docker compose down`. To also delete the database
volume and all its data, run `docker compose down --volumes`.

To install dependencies:

```bash
bun install
```

Set `DATABASE_URL` to your PostgreSQL connection string before starting the
server. For example, for a local PostgreSQL database:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_db
```

Generate the Prisma client and apply the database migration:

```bash
bun run db:generate
bun run db:migrate
```

For production, apply committed migrations with `bun run db:deploy`. The Prisma
schema and migration are in `prisma/`.

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.12. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
