# Shortly --- URL Shortener

> A production-oriented, full-stack URL shortening service built with
> React, Node.js, PostgreSQL, Redis, BullMQ, and Docker.

Shortly is designed as a system-design-focused URL shortener rather than
a simple CRUD application. It focuses on fast URL resolution, persistent
storage, Redis caching, asynchronous analytics processing, rate
limiting, clean backend separation, automated testing, and containerized
deployment.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Core Request Flows](#core-request-flows)
- [Caching Strategy](#caching-strategy)
- [Rate Limiting](#rate-limiting)
- [URL Expiration](#url-expiration)
- [Base62 ID Generation](#base62-id-generation)
- [Data Model](#data-model)
- [Backend Architecture](#backend-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Security](#security)
- [Testing](#testing)
- [Docker Architecture](#docker-architecture)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [Environment Variables](#environment-variables)
- [Scalability](#scalability)
- [Engineering Trade-offs](#engineering-trade-offs)
- [Failure Scenarios](#failure-scenarios)
- [Future Improvements](#future-improvements)
- [Author](#author)

## Overview

Shortly allows users to:

1.  Submit a long URL.
2.  Generate a compact short code.
3.  Optionally provide a custom alias.
4.  Optionally configure an expiration time.
5.  Access the shortened URL through a fast redirect path.
6.  View click analytics.

The system separates latency-sensitive redirect operations from
background analytics processing.

## Features

### URL Management

- Create shortened URLs.
- Automatically generate Base62 short codes.
- Support custom aliases.
- Configure URL expiration.
- List created URLs.
- Retrieve individual URL details.
- Detect expired URLs.

### Redirect System

- Fast short-code resolution.
- Redis cache-aside strategy.
- PostgreSQL fallback on cache misses.
- HTTP 302 redirects.
- Expiration checks.
- Redis-backed rate limiting.

### Analytics

- Record click events.
- Queue analytics asynchronously.
- Process events using BullMQ workers.
- Persist click events in PostgreSQL.
- Provide click history grouped by date.

### Backend

- Express 5 REST API.
- TypeScript.
- PostgreSQL connection pooling.
- Redis integration.
- BullMQ background processing.
- Centralized error handling.
- Request validation.
- Helmet security headers.
- Request body size limits.
- Environment-based configuration.
- Graceful application shutdown.

### Infrastructure

- Dockerized frontend.
- Dockerized API.
- Dedicated analytics worker.
- PostgreSQL container.
- Redis container.
- Persistent Docker volumes.
- Nginx for production frontend serving.
- Database migrations.
- Container healthchecks.
- Dependency-aware startup.

### Testing

- Vitest.
- Supertest.
- API integration tests.
- Repository tests.
- URL validation tests.
- Base62 tests.
- Redirect tests.
- Rate-limit tests.
- Analytics worker tests.
- Queue tests.

# Architecture

```text
                              Browser
                                 |
                              :5173
                                 |
                                 v
                         +---------------+
                         | Nginx / React |
                         +-------+-------+
                                 |
                              REST API
                                 |
                                 v
                         +---------------+
                         | Express API   |
                         |    :3000      |
                         +---+-------+---+
                             |       |
                    +--------+       +--------+
                    v                         v
              +-----------+             +-----------+
              | PostgreSQL|             |   Redis   |
              |   :5432   |             |   :6379   |
              +-----------+             +-----+-----+
                                             |
                                             | BullMQ
                                             v
                                      +-------------+
                                      |   Worker    |
                                      |  Analytics  |
                                      +-------------+
                                             |
                                             v
                                      +-------------+
                                      | PostgreSQL  |
                                      | click_events|
                                      +-------------+
```

## Core Request Flows

### 1. URL Creation Flow

```text
Client
  |
  | POST /api/urls
  v
Express Router
  |
  v
Controller
  |
  v
Input Validation
  |
  +---- Invalid ------> 400
  |
  v
URL Service
  |
  v
PostgreSQL Sequence
  |
  v
BigInt ID
  |
  v
Base62 Encoding
  |
  v
PostgreSQL Transaction
  |
  v
Created URL
```

Custom aliases bypass automatic Base62 generation when supplied.

### 2. URL Redirect Flow

```text
GET /abc123
      |
      v
Rate Limiter
      |
      v
URL Service
      |
      v
Redis Cache
      |
      +---- HIT ----------> URL
      |                      |
      |                      v
      |                  302 Redirect
      |
      +---- MISS
             |
             v
        PostgreSQL
             |
             v
        Cache Result
             |
             v
         302 Redirect
```

PostgreSQL remains the source of truth while Redis provides the
low-latency read path.

### 3. Analytics Flow

Analytics are intentionally removed from the critical redirect path.

```text
GET /abc123
     |
     v
Resolve URL
     |
     +--------------------+
     |                    |
     v                    v
Queue analytics       302 Redirect
     |
     v
   Redis
     |
     v
  BullMQ
     |
     v
Analytics Worker
     |
     v
PostgreSQL
     |
     v
click_events
```

The API queues the analytics event and returns the redirect without
waiting for the worker to persist the click.

## Caching Strategy

Shortly uses a **cache-aside** strategy for URL resolution.

### Cache hit

```text
Application -> Redis -> Cached URL
```

### Cache miss

```text
Application -> Redis
                 |
                MISS
                 v
             PostgreSQL
                 |
                 v
               Redis
                 |
                 v
            Application
```

URL shorteners generally have a read-heavy access pattern. Caching
frequently accessed URLs reduces PostgreSQL reads and provides a faster
resolution path.

PostgreSQL remains authoritative, so loss of cached data does not remove
the underlying URL records.

## Rate Limiting

Shortly uses Redis-backed rate limiting for public/high-frequency
endpoints.

Operation Limit

---

Create URL 10 requests / 60 seconds
Redirect 60 requests / 60 seconds

The state is maintained outside the API process, making the approach
suitable for future horizontal API scaling.

## URL Expiration

URLs can optionally expire after:

- Never
- 1 hour
- 1 day
- 7 days
- 30 days

The backend validates that an explicitly supplied expiration is a valid
date and is in the future.

During resolution:

```text
URL found?
    |
    v
Expired?
  /   \
Yes    No
 |      |
 v      v
410   Redirect
```

An expired URL returns `410 Gone`.

## Base62 ID Generation

Automatically generated short codes are based on PostgreSQL sequence IDs
encoded using Base62.

Character set:

```text
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

The implementation uses JavaScript `BigInt` for database IDs to avoid
JavaScript `Number` precision limitations as the ID space grows.

### Why use a database sequence?

Advantages:

- Compact codes.
- Fast generation.
- No collision checking for generated codes.
- Simple implementation.
- No separate ID-generation infrastructure.

Trade-off:

- Sequential IDs can make generated short codes more predictable.

Custom aliases are handled separately and validated for length and
allowed characters.

## Data Model

### `urls`

Stores shortened URL metadata.

```text
urls
├── id
├── short_code
├── original_url
├── expires_at
├── created_at
└── ...
```

### `click_events`

Stores individual click events.

```text
click_events
├── id
├── url_id
├── clicked_at
└── ...
```

Relationship:

```text
urls 1 ----------- N click_events
```

## Backend Architecture

The backend is organized as a modular monolith with clear separation of
responsibilities.

```text
server/src/
|
+-- config/
|
+-- infrastructure/
|   +-- postgres/
|   +-- redis/
|   +-- queue/
|
+-- middleware/
|
+-- modules/
|   +-- urls/
|   +-- redirect/
|   +-- analytics/
|
+-- utils/
```

Primary request path:

```text
Routes
  |
Controllers
  |
Services
  |
Repositories
  |
Infrastructure
```

- **Routes:** HTTP endpoints and middleware composition.
- **Controllers:** Translate HTTP requests into service calls and
  responses.
- **Services:** Application and business logic.
- **Repositories:** PostgreSQL data access.
- **Infrastructure:** Database, Redis, and queue clients.
- **Worker:** Independent analytics processing.

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite 7
- React Router 7
- Tailwind CSS 4
- Recharts

### Backend

- Node.js
- Express 5
- TypeScript
- PostgreSQL
- Redis
- BullMQ
- ioredis

### Testing

- Vitest
- Supertest

### Infrastructure

- Docker
- Docker Compose
- Nginx
- PostgreSQL
- Redis

## Project Structure

```text
url-shortener/
|
+-- src/
|   +-- components/
|   +-- config/
|   +-- hooks/
|   +-- pages/
|   +-- services/
|   +-- ...
|
+-- server/
|   +-- src/
|   |   +-- config/
|   |   +-- infrastructure/
|   |   |   +-- postgres/
|   |   |   +-- redis/
|   |   |   +-- queue/
|   |   +-- middleware/
|   |   +-- modules/
|   |   |   +-- analytics/
|   |   |   +-- redirect/
|   |   |   +-- urls/
|   |   +-- utils/
|   |
|   +-- migrations/
|   +-- Dockerfile
|   +-- package.json
|   +-- tsconfig.json
|   +-- vitest.config.ts
|
+-- Dockerfile
+-- docker-compose.yml
+-- nginx.conf
+-- package.json
+-- .dockerignore
+-- README.md
```

## API Reference

### Create Short URL

```http
POST /api/urls
Content-Type: application/json
```

Example:

```json
{
  "longUrl": "https://example.com/some/very/long/path",
  "customAlias": "example",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

`customAlias` and `expiresAt` are optional.

Supported alias characters:

```text
a-z
A-Z
0-9
-
_
```

Alias length:

```text
3-30 characters
```

### List URLs

```http
GET /api/urls
```

### Get URL

```http
GET /api/urls/:id
```

### URL Analytics

```http
GET /api/urls/:id/analytics
```

### Redirect

```http
GET /:shortCode
```

Returns an HTTP redirect to the original URL.

Example:

```http
HTTP/1.1 302 Found
Location: https://example.com
```

### Health

```http
GET /health
```

Used to determine whether the API is ready to serve requests.

## Error Handling

The backend uses centralized error middleware and a consistent API error
structure.

Example:

```json
{
  "error": "INVALID_REQUEST",
  "message": "longUrl must be a valid absolute URL"
}
```

Common application-level errors:

    Status Meaning

---

       400 Invalid request
       404 URL/resource not found
       410 URL expired
       429 Rate limit exceeded
       500 Unexpected server error

## Security

The API includes several application-level protections.

### Helmet

Security-related HTTP headers are configured using Helmet.

### Request body limits

JSON request bodies are limited to 10 KB.

### Input validation

URL creation validates:

- Required long URL.
- Absolute URL format.
- HTTP/HTTPS protocol.
- Custom alias length.
- Custom alias characters.
- Expiration date.

### Rate limiting

Public endpoints are protected using Redis-backed rate limits.

### Centralized errors

Unexpected errors are converted into a safe generic server response
instead of exposing internal details.

## Testing

The backend uses **Vitest** as the test runner and **Supertest** for
HTTP-level integration testing.

Run the test suite:

```bash
npm --prefix server test
```

Run tests in watch mode:

```bash
npm --prefix server run test:watch
```

The test suite covers areas including:

- Base62 encoding.
- URL validation.
- URL repository operations.
- URL service behavior.
- API routes.
- Redirect behavior.
- Analytics processing.
- BullMQ job handling.
- Rate limiting.
- Error handling.
- Worker processing.

A dedicated Vitest configuration excludes compiled files under `dist/`
from test discovery.

## Docker Architecture

The complete stack runs with Docker Compose.

```text
+-------------------------------------------------------+
|                  Docker Compose                       |
|                                                       |
|  +-------------+      +-------------+                 |
|  |   Frontend  |----->|     API     |                 |
|  | React/Nginx |      |   Express   |                 |
|  |    :5173    |      |    :3000    |                 |
|  +-------------+      +------+------+
|                               |                       |
|                      +--------+--------+              |
|                      v                 v              |
|               +------------+    +------------+         |
|               | PostgreSQL |    |   Redis    |         |
|               |    :5432   |    |    :6379   |         |
|               +------------+    +------+-----+         |
|                                      |                |
|                                      v                |
|                               +-------------+         |
|                               |   Worker    |         |
|                               |   BullMQ    |         |
|                               +-------------+         |
|                                                       |
+-------------------------------------------------------+
```

The frontend uses a multi-stage Docker build:

```text
Node.js build
     |
     v
Vite production bundle
     |
     v
Nginx Alpine image
```

The backend uses a separate production image, while the analytics worker
runs from the compiled backend image with a different entry point.

## Docker Healthchecks

Service Healthcheck

---

PostgreSQL `pg_isready`
Redis `redis-cli ping`
API `GET /health`
Frontend Nginx `/`

The API waits for PostgreSQL and Redis to become healthy.

The frontend waits for the API healthcheck before starting.

## Database Migrations

Database migrations are stored under:

```text
server/migrations/
```

During container startup, the API runs the compiled migration runner
before starting Express:

```bash
node dist/infrastructure/postgres/migrate.js
```

This allows a fresh PostgreSQL container to initialize its schema
automatically.

## Persistence

PostgreSQL and Redis use named Docker volumes:

```yaml
volumes:
  postgres_data:
  redis_data:
```

Normal container recreation therefore does not automatically remove
persisted data.

## Running Locally

### Prerequisites

- Node.js 22+
- npm
- PostgreSQL
- Redis

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
cd ..
```

Create:

```text
.env
server/.env
```

Run migrations:

```bash
npm --prefix server run db:migrate
```

Start the complete development environment:

```bash
npm run dev
```

This starts:

```text
Vite frontend
Express API
Analytics worker
```

## Running with Docker

Start the complete stack:

```bash
docker compose up -d
```

Check service status:

```bash
docker compose ps
```

View API logs:

```bash
docker compose logs api
```

View worker logs:

```bash
docker compose logs worker
```

View all logs:

```bash
docker compose logs
```

Stop the stack:

```bash
docker compose down
```

Application:

```text
http://localhost:5173
```

API:

```text
http://localhost:3000
```

Health:

```text
http://localhost:3000/health
```

## Environment Variables

### Frontend

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SHORT_URL_DOMAIN=short.ly
```

### Backend

```env
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173

DATABASE_URL=postgresql://shortly:shortly@localhost:5432/shortly
DB_POOL_MAX=10

SHORT_URL_DOMAIN=short.ly

REDIS_URL=redis://localhost:6379
```

When running inside Docker, container-to-container communication uses:

```text
postgres:5432
redis:6379
```

The frontend API URL remains `http://localhost:3000` because
Vite-generated JavaScript executes in the user's browser, not inside the
Docker network.

## Build Commands

Build the complete application:

```bash
npm run build
```

Build only the frontend:

```bash
npm run build:client
```

Build only the backend:

```bash
npm run build:server
```

The frontend Docker image intentionally uses `build:client` so it does
not compile the backend as part of the frontend image.

## Scalability

The current architecture allows the API and analytics worker to scale
independently.

```text
                    Load Balancer
                         |
             +-----------+-----------+
             v           v           v
          API #1       API #2       API #3
             |           |           |
             +-----------+-----------+
                         |
                +--------+--------+
                v                 v
              Redis          PostgreSQL
                |
                v
          Worker Pool
```

### API scaling

The API can be horizontally scaled because cache and rate-limit state
are stored in Redis rather than process-local memory.

### Worker scaling

Analytics workers can be scaled independently when the analytics queue
grows.

### Database scaling

For a larger deployment, PostgreSQL could be extended with read
replicas, connection-pooling infrastructure, partitioning for large
click-event tables, query/index optimization, and automated backups.

### Redis scaling

A larger deployment could use Redis Sentinel or Redis Cluster depending
on availability and throughput requirements.

## Engineering Trade-offs

### PostgreSQL Sequence + Base62 vs Random Codes

**Chosen:** PostgreSQL sequence IDs encoded using Base62.

Advantages:

- Compact codes.
- Fast generation.
- No collision checking for generated codes.
- Simple implementation.
- No separate ID-generation infrastructure.

Trade-off:

- Sequential IDs can make generated short codes more predictable.

### Redis Cache vs Database-only Resolution

**Chosen:** Redis + PostgreSQL fallback.

Advantages:

- Lower latency for hot URLs.
- Reduced PostgreSQL read load.
- Good fit for read-heavy workloads.

Trade-offs:

- Additional infrastructure.
- Cache invalidation considerations.
- Additional operational dependency.

PostgreSQL remains the source of truth.

### Synchronous vs Asynchronous Analytics

**Chosen:** Asynchronous analytics.

Advantages:

- Faster redirect path.
- Analytics workload isolated from the API.
- Worker workload can scale independently.

Trade-offs:

- Analytics are eventually consistent.
- Requires queue infrastructure.
- A queued event is not persisted immediately.

### Modular Monolith vs Microservices

**Chosen:** Modular monolith + dedicated analytics worker.

The application does not split every domain into separate microservices.

This avoids premature distributed-system complexity while still
separating analytics because it has a different execution model from the
HTTP API.

## Failure Scenarios

### PostgreSQL unavailable

The application cannot persist or resolve URLs when a cache miss
requires the database.

### Redis unavailable

The application loses its cache, rate-limit state, and BullMQ queue
infrastructure.

### Analytics worker unavailable

Analytics jobs can remain queued until a worker becomes available,
depending on queue configuration and job retention.

### Cache miss

The API falls back to PostgreSQL and can repopulate the Redis cache.

### Expired URL

The API returns `410 Gone` instead of redirecting.

### Invalid URL

The API rejects the request with `400 Bad Request`.

### Excessive requests

The rate limiter returns `429 Too Many Requests`.

## Performance Considerations

The architecture assumes a URL shortener is predominantly read-heavy.

Key performance decisions include:

- **Redis URL caching:** Reduces repeated PostgreSQL lookups for
  frequently accessed URLs.
- **PostgreSQL connection pooling:** Reuses database connections
  instead of opening one per request.
- **Asynchronous analytics:** Removes click-event persistence from the
  critical redirect path.
- **Dedicated worker:** Prevents background analytics processing from
  consuming API request-handling capacity.
- **Compact Base62 codes:** Produces short URLs without an additional
  code-generation service.

## Future Improvements

Potential extensions include:

- Authentication and user accounts.
- Per-user URL management.
- Custom domains.
- QR code generation.
- Advanced analytics.
- Geographic analytics.
- Device and browser analytics.
- PostgreSQL read replicas.
- Click-event partitioning.
- Redis Cluster/Sentinel.
- Prometheus metrics.
- OpenTelemetry tracing.
- Centralized structured logging.
- CI/CD pipeline.
- Cloud deployment.
- CDN integration.
- Automated database backups.
- Distributed ID generation.
- Abuse and spam detection.
- URL safety scanning.

## What This Project Demonstrates

Shortly demonstrates practical experience with:

- Full-stack TypeScript development.
- REST API design.
- React application architecture.
- PostgreSQL data modeling.
- Database transactions.
- Connection pooling.
- BigInt handling.
- Base62 encoding.
- Redis caching.
- Cache-aside architecture.
- Redis-backed rate limiting.
- BullMQ background jobs.
- Worker-based architecture.
- Eventual consistency.
- Input validation.
- Centralized error handling.
- API integration testing.
- Docker and Docker Compose.
- Nginx.
- Container healthchecks.
- Database migrations.
- Service dependency management.
- Scalability planning.
- Backend architecture and trade-off analysis.

## Author

**Apoorva Sharma**

GitHub: https://github.com/appy-11
