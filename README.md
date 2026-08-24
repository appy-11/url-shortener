# URL Shortener

A modular-monolith URL shortener built with React, Node.js, PostgreSQL, Redis, and an async analytics pipeline.

## Features

- Generate short URLs using Base62 IDs
- Optional custom aliases
- URL expiry
- HTTP 302 redirects
- Click analytics
- Redis caching for frequently accessed URLs
- Rate limiting
- Asynchronous analytics logging
- Responsive dashboard with search and status filtering
- Light/dark theme support

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts

### Backend

- Node.js
- PostgreSQL
- Redis
- Queue for async analytics
- Docker

## Architecture

The backend follows a **Modular Monolith** architecture.

```text
                    ┌──────────────┐
                    │   Frontend   │
                    │ React + Vite │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Node.js API │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         PostgreSQL      Redis       Rate Limit
              │            │
              │            │
              └──────┬─────┘
                     │
                     ▼
                  Queue
                     │
                     ▼
               Analytics
```
