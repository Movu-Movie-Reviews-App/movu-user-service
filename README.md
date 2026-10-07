# User Service

User profile microservice for the Movu platform. Owns user profiles, favorites, and wishlists. Communicates exclusively over NATS — all client traffic reaches it through the [client-gateway](../client-gateway), and profiles are created in response to registrations handled by the [auth-service](../auth-service).

## Tech stack

- [NestJS](https://nestjs.com/) 11 (microservice mode)
- [NATS](https://nats.io/) transport (`@nestjs/microservices`)
- [TypeORM](https://typeorm.io/) + PostgreSQL (`pg`)
- `class-validator` / `class-transformer` for DTO validation
- `Joi` for environment variable validation

## Architecture

The service registers as a NATS microservice (no HTTP listener). It exposes user profile, favorite, and wishlist message patterns consumed by the client-gateway and by auth-service (for profile creation on registration).

```
client-gateway --(NATS)--> user-service ── user-db (PostgreSQL)
auth-service   --(NATS)-->      ^
                                 └── favorites, wishlist
```

## Message patterns

| Pattern | Description |
|---|---|
| `users.create` | Create a user profile |
| `users.findAll` | List user profiles |
| `users.findByIds` | Bulk lookup of user profiles by id |
| `users.findOne` | Get a single user profile |
| `users.update` | Update a user profile |
| `users.remove` | Delete a user profile |
| `users.getPreferences` | Get a user's preferences |
| `favorites.create` | Add a favorite |
| `favorites.findAllByUser` | List a user's favorites |
| `favorites.findOne` | Get a specific favorite |
| `favorites.remove` | Remove a favorite |
| `wishlist.create` | Add to wishlist |
| `wishlist.findAllByUser` | List a user's wishlist |
| `wishlist.findOne` | Get a specific wishlist entry |
| `wishlist.remove` | Remove from wishlist |

## Requirements

- Node.js 21+
- Docker & Docker Compose (recommended)
- A running PostgreSQL instance and NATS server (provided via Docker Compose)

## Environment variables

Configuration is validated in `src/config/envs.ts`. When run via the root `docker-compose.yml`, these are supplied automatically from the repo-level `.env` file.

| Variable | Description |
|---|---|
| `PORT` | Port the service reports as running on (informational; NATS transport has no HTTP port) |
| `DB_HOST` | PostgreSQL host |
| `USER_DB_PORT` | PostgreSQL port |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `USER_DB_NAME` | PostgreSQL database name |
| `NATS_SERVERS` | Comma-separated list of NATS server URLs |

## Running the service

### With Docker Compose (recommended)

From the repository root:

```bash
cp .env.template .env
# fill in the required values in .env
docker compose up user-service user-db nats-server
```

Or start the entire stack:

```bash
docker compose up
```

### Standalone (local development)

```bash
npm install
```

Create a `.env` file in this directory with the variables listed above, then:

```bash
npm run start:dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run start` | Start the service |
| `npm run start:dev` | Start in watch mode |
| `npm run start:debug` | Start in watch mode with the debugger attached |
| `npm run start:prod` | Run the compiled build (`dist/main`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run lint` | Lint and auto-fix source files |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage report |

## Project structure

```
src/
├── user/
│   ├── user.controller.ts    # NATS message pattern handlers
│   ├── user.service.ts       # Business logic
│   ├── dto/                  # Request payload validation
│   └── entities/              # TypeORM entity
├── favorite/                    # Favorites CRUD
├── wishlist/                      # Wishlist CRUD
├── common/
│   ├── constants/                   # Shared regex/constants
│   ├── enums/                         # Content type, search field enums
│   └── helpers/                        # Search field helpers
├── config/                               # Environment variable validation
├── app.module.ts
└── main.ts
```
