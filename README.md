# TinyLink – URL Shortener

TinyLink is a simple URL shortener built with **Next.js**, **PostgreSQL**, and **Docker**.
Users can create short links, view stats, copy links, open links, and delete them from a clean dashboard.

---

## 🚀 Tech Stack

- Next.js (App Router)
- PostgreSQL (Neon)
- Tailwind CSS
- SWR (data fetching)

---

## 📦 Features

- Create short links
- Optional custom code (6–8 chars)
- Redirect via `/:code`
- Click count tracking
- Stats page `/code/:code`
- Delete links
- API documentation at `/docs`
- Clean UI with copy/open/stats/delete icons

---

## 🛠 Setup

### 1. Install dependencies

```
npm install
```

### 2. Start PostgreSQL (via Docker)

```
docker compose up -d
```

### 3. Add environment variables

Create `.env` and fill:

```
DATABASE_URL=postgres://tinylink:secret@localhost:5432/tinylink
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run migrations

```
npm run migrate
```

### 5. Start the app

```
npm run dev
```

Visit:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔌 API Endpoints

**Create link**
`POST /api/links`

**List links**
`GET /api/links`

**Link stats**
`GET /api/links/:code`

**Delete link**
`DELETE /api/links/:code`

**Redirect**
`GET /:code`

**Health check**
`GET /healthz`

---

## 📘 API Docs

Full documentation available at:
👉 **/docs**

---

## 📂 Project Structure

```
app/
  page.js           → Dashboard
  docs/page.js      → API docs
  code/[code]/page.js → Stats page
  api/
    links/route.js
    links/[code]/route.js
    [code]/route.js → Redirect
lib/
migrations/
components/
```

---
