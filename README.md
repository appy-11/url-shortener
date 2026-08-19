# Url Shortener

## UX Flow

### 1. Create Short URL

```text
                    ┌──────────────────┐
                    │   Create URL     │
                    │                  │
                    │ Long URL         │
                    │ Custom Alias     │
                    │ Expiry           │
                    │                  │
                    │ [Shorten URL]    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  URL Created     │
                    │                  │
                    │ short.ly/aB72x   │
                    │                  │
                    │ Copy URL         │
                    │ View Analytics   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ URL Analytics    │
                    │                  │
                    │ Clicks: 1,284    │
                    │ Created: ...     │
                    │ Expires: ...     │
                    └──────────────────┘
```

### 2. Redirect Flow

When a user visits the shortened URL:

```text
User visits /aB72x
        │
        ▼
   Redis / DB lookup
        │
        ▼
   Original URL
        │
        ▼
      HTTP 302
     Redirect
        │
        └──────────────► Async Analytics Event
```

### Request Flow

1. User submits a long URL with optional custom alias and expiry.
2. Backend validates the URL and expiry.
3. A unique **Base62 ID** is generated unless a custom alias is provided.
4. URL mapping is persisted in **PostgreSQL**.
5. The mapping can be cached in **Redis** for fast redirects.
6. The generated short URL is returned to the client.
7. When the short URL is visited, the backend checks **Redis first**, then falls back to PostgreSQL.
8. The user receives an HTTP **302 redirect** to the original URL.
9. Click analytics are published asynchronously to a queue so the redirect path remains fast.

### Example

```text
Create:
POST /api/urls

{
  "longUrl": "https://example.com/very/long/url",
  "customAlias": "docs",
  "expiresAt": "2026-12-31T23:59:59Z"
}

Response:

{
  "shortUrl": "https://short.ly/docs",
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

Redirect:

```text
GET /docs

        │
        ▼
     Redis
        │
    Cache Hit?
      /   \
    Yes    No
     │      │
     │    PostgreSQL
     │      │
     └──┬───┘
        ▼
   Original URL
        │
        ▼
    HTTP 302
        │
        ▼
   Async Analytics
```

The redirect path is intentionally kept lightweight: **lookup → redirect → analytics event**.

### UX Layout

```text
┌───────────────────────────────────────────────────────┐
│  Shortly                         Analytics     Links  │
├───────────────────────────────────────────────────────┤
│                                                       │
│              Create a short URL                       │
│                                                       │
│   Paste your long URL                                 │
│   ┌───────────────────────────────────────────────┐   │
│   │ https://example.com/some/very/long/url        │   │
│   └───────────────────────────────────────────────┘   │
│                                                       │
│   Custom alias (optional)                             │
│   ┌───────────────────────────────────────────────┐   │
│   │ my-link                                       │   │
│   └───────────────────────────────────────────────┘   │
│                                                       │
│   Expiry (optional)                                   │
│   ┌───────────────────────────────────────────────┐   │
│   │ 30 days ▼                                     │   │
│   └───────────────────────────────────────────────┘   │
│                                                       │
│                    [ Create Short URL ]               │
│                                                       │
└───────────────────────────────────────────────────────┘

```

### Input Specifications

### Long URL

**Required**

The long URL must be a valid absolute URL.

**Valid:**

```text
https://example.com
https://www.google.com/search?q=test
https://example.com/products/123
```

**Invalid:**

```text
example.com
abc
www.example.com
```

**Validation rules:**

- Must include a valid protocol such as `http://` or `https://`
- Must contain a valid hostname
- Reject malformed URLs
- Reject empty values

---

### Custom Alias

**Optional**

Users can provide a custom alias instead of using the automatically generated Base62 ID.

**Examples:**

```text
short.ly/my-course
short.ly/apoorva
short.ly/product-demo
```

**Constraints:**

```text
Length: 3–30 characters
Allowed: a-z, A-Z, 0-9, -, _
Must be unique
```

**Valid:**

```text
my-course
apoorva
product_demo
product-demo-2026
```

**Invalid:**

```text
ab                  # Less than 3 characters
this-alias-is-way-too-long-for-url   # More than 30 characters
my course           # Spaces not allowed
my@course           # Special characters not allowed
```

If the alias already exists, the API should return a conflict response:

```text
HTTP 409 Conflict
```

Example:

```json
{
  "error": "CUSTOM_ALIAS_ALREADY_EXISTS",
  "message": "The alias 'product-demo' is already in use."
}
```

---

### Expiry

**Optional**

Users can choose when the shortened URL should expire.

Available options:

| Option | Description |
|---|---|
| Never | URL does not expire |
| 1 hour | Expires 1 hour after creation |
| 1 day | Expires 24 hours after creation |
| 7 days | Expires after 7 days |
| 30 days | Expires after 30 days |
| Custom | User selects a specific expiry date/time |

### Example

```text
Expiry
────────────────────
○ Never
○ 1 hour
○ 1 day
○ 7 days
○ 30 days
○ Custom
```

For a custom expiry, the selected time must be in the future.

```text
expiresAt > currentTime
```

Once a URL expires:

```text
GET /aB72x
       │
       ▼
   Redis / DB
       │
       ▼
   Check expiry
       │
   ┌───┴────┐
   │        │
 Valid    Expired
   │        │
   ▼        ▼
  302    410 Gone
 Redirect
```

Recommended response for an expired URL:

```text
HTTP 410 Gone
```

```json
{
  "error": "URL_EXPIRED",
  "message": "This shortened URL has expired."
}
```

### URL Created State

#### After clicking Create Short URL, don't navigate immediately.

Show a success card.
```text
┌─────────────────────────────────────────────┐
│                                             │
│         ✓URL created successfully           │
│                                             │
│   Your short URL                            │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ https://short.ly/aB72x        [Copy]  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Redirects to                               │
│  https://example.com/course/react/...       │
│                                             │
│  Expires                                    │
│  Never                                      │
│                                             │
│       [ View Analytics ]  [Create Another]  │
│                                             │
└─────────────────────────────────────────────┘

```

This gives you a nice UX moment and also gives us a place to demonstrate the Base62-generated ID.


