# Katasphere — Complete Project Context & Architecture Reference

> **Tagline**: Practice. Improve. Repeat.  
> **Repository**: [https://github.com/hrishu22/Katasphere](https://github.com/hrishu22/Katasphere)  
> **Workspace**: `/Users/hrishii/Desktop/katasphere`

---

## 1. Product Vision & Overview

**Katasphere** is a production-minded full-stack online coding practice platform inspired by the developer-first experience of LeetCode and HackerRank. It allows developers to solve algorithmic problems (katas), run real code executions across multiple languages (Java, Python, C++, and JavaScript) via Judge0, validate against comprehensive test suites, follow structured interview preparation tracks (such as the Blind 75), and track mastery over time.

---

## 2. Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router) with React 18
- **Language**: TypeScript (Strict type checking)
- **Styling**: Tailwind CSS with custom CSS variables design system
- **Theme Support**: Seamless Dark Mode & Light Mode with `ThemeProvider` and `ThemeToggle`
- **Icons**: Lucide React
- **Editor Canvas**: Monaco Editor integration foundation with multi-language tabs
- **Data Fetching & API**: Centralized typed HTTP client (`src/lib/api-client.ts`) with cookie session support

### Backend
- **Language & Runtime**: Java 17 LTS / Java 21 compatible
- **Framework**: Spring Boot 3.3.4 (Modular Monolith)
- **Web & Security**: Spring Web, Spring Security (Session-based with HttpOnly cookies), BCrypt password hashing
- **Data Persistence**: Spring Data JPA, Hibernate 6 with JSONB support (`@JdbcTypeCode(SqlTypes.JSON)`)
- **Database Driver**: PostgreSQL JDBC Driver
- **Migrations**: Flyway database migrations
- **Diagnostics**: Spring Boot Actuator (`/actuator/health`) & Custom Health Controller (`/api/v1/health`)
- **Testing**: JUnit 5, Mockito (subclass mock-maker), Spring Boot Test, H2 in-memory PostgreSQL compatibility mode

### Database
- **Provider**: PostgreSQL 16
  - **Local Development**: Docker Compose (`katasphere_postgres`) or local PostgreSQL instance.
  - **Cloud Production**: Supabase-hosted PostgreSQL with mandatory SSL (`sslmode=require`) and HikariCP connection pooling.
- **Keys**: UUID primary keys generated via `gen_random_uuid()`.

### Code Execution
- **Provider**: Judge0 Community Edition / Hosted API.
- **Rule**: Frontend never calls Judge0 directly. Only the backend invokes Judge0 using server-side credentials.

---

## 3. Project Structure (Monorepo)

```text
katasphere/
├── .github/
│   └── workflows/
│       └── ci.yml                     # Automated CI build & test pipeline
├── backend/
│   ├── mvnw                           # Maven wrapper script
│   ├── pom.xml                        # Maven configuration (Spring Boot 3.3.4)
│   ├── .env.example                   # Backend environment template
│   └── src/
│       ├── main/
│       │   ├── java/com/katasphere/
│       │   │   ├── KatasphereApplication.java
│       │   │   ├── common/            # Standard ApiResponse, ErrorResponse, GlobalExceptionHandler
│       │   │   ├── config/            # SecurityConfig, CorsConfig
│       │   │   ├── auth/              # AuthController, AuthService, AuthIdentity, DTOs
│       │   │   ├── user/              # UserController, User, UserRepository, UserDto
│       │   │   ├── problem/           # Problem, ProblemController, ProblemService, ProblemAdminService,
│       │   │   │                      # TestCase, ProblemExample, ProblemDataInitializer, DTOs
│       │   │   ├── tag/               # Tag, TagRepository, TagDto
│       │   │   └── health/            # HealthController (/api/v1/health)
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-local.yml
│       │       ├── application-supabase.yml
│       │       ├── application-prod.yml
│       │       ├── problems/
│       │       │   └── catalog.json   # Declarative problem dataset (auto-ingested on boot)
│       │       └── db/migration/
│       │           ├── V1__create_users_and_auth_identities.sql
│       │           └── V2__create_problems_and_tags.sql
│       └── test/
│           ├── java/com/katasphere/
│           │   ├── KatasphereApplicationTests.java
│           │   ├── health/HealthControllerTest.java
│           │   └── auth/AuthControllerTest.java
│           └── resources/
│               ├── application-test.yml
│               └── mockito-extensions/org.mockito.plugins.MockMaker
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.mjs
│   ├── .env.example
│   └── src/
│       ├── app/
│       │   ├── layout.tsx             # Root layout with ThemeProvider and AuthProvider
│       │   ├── globals.css            # Dark and light theme CSS variable palettes
│       │   ├── page.tsx               # Public landing page with value proposition
│       │   ├── dashboard/page.tsx     # Protected developer dashboard (auth required)
│       │   ├── interview-prep/page.tsx# Blind 75, Top 150 & Big Tech company tracks
│       │   ├── problems/
│       │   │   ├── page.tsx           # Dynamic problem catalog with search & tag filters
│       │   │   ├── new/page.tsx       # Web-based question creator / builder
│       │   │   └── [slug]/page.tsx    # Split-pane problem coding workspace
│       │   ├── login/page.tsx         # Interactive sign-in form with eye toggle
│       │   ├── register/page.tsx      # Interactive registration form
│       │   └── profile/page.tsx       # User profile management
│       ├── components/
│       │   ├── layout/                # AppShell, Navbar, Footer
│       │   └── ui/                    # ThemeToggle, buttons
│       ├── contexts/
│       │   ├── AuthContext.tsx        # Client authentication state & session hooks
│       │   └── ThemeContext.tsx       # Dark / Light mode state & localStorage persistence
│       └── lib/
│           ├── api-client.ts          # Centralized typed HTTP client
│           └── utils.ts
├── infrastructure/
│   └── docker-compose.yml             # Local PostgreSQL 16 container definition
├── docker-compose.yml                 # Root compose entrypoint
├── .env.example                       # Root environment template
├── README.md                          # Quickstart developer guide
└── PROJECT_CONTEXT.md                 # This context file
```

---

## 4. Database Schema & Flyway Migrations

### Migration `V1__create_users_and_auth_identities.sql`
- **`users`**:
  - `id`: UUID (PK, `gen_random_uuid()`)
  - `name`: VARCHAR(255) NOT NULL
  - `email`: VARCHAR(255) NOT NULL UNIQUE (case-insensitive lookup via index)
  - `avatar_url`: VARCHAR(1024)
  - `role`: VARCHAR(50) DEFAULT 'USER'
  - `created_at`, `updated_at`: TIMESTAMPTZ
- **`auth_identities`**:
  - `id`: UUID (PK)
  - `user_id`: UUID (FK -> users.id ON DELETE CASCADE)
  - `provider`: VARCHAR(50) ('LOCAL' or 'GOOGLE')
  - `provider_subject`: VARCHAR(255) (null for local, Google subject ID for OAuth)
  - `password_hash`: VARCHAR(255) (BCrypt hash for local, null for OAuth)
  - Partial unique indexes ensuring one LOCAL identity per user and unique provider subjects.

### Migration `V2__create_problems_and_tags.sql`
- **`problems`**:
  - `id`: UUID (PK)
  - `slug`: VARCHAR(255) UNIQUE
  - `title`: VARCHAR(255) NOT NULL
  - `description`: TEXT NOT NULL
  - `difficulty`: VARCHAR(20) ('EASY', 'MEDIUM', 'HARD')
  - `constraints_text`: TEXT NOT NULL
  - `starter_code`: JSONB (mapping language keys `PYTHON`, `JAVA`, `CPP`, `JAVASCRIPT` to code stubs)
  - `input_format`, `output_format`: TEXT
- **`tags`**:
  - `id`: UUID (PK)
  - `name`: VARCHAR(100) UNIQUE
  - `slug`: VARCHAR(100) UNIQUE
- **`problem_tags`**:
  - Composite PK (`problem_id`, `tag_id`)
- **`problem_examples`**:
  - Public sample cases with inputs, outputs, explanations.
- **`test_cases`**:
  - Sample and hidden evaluation cases (`is_hidden` boolean).

---

## 5. Live REST API Contracts

Base URL: `http://localhost:8080/api/v1`

### Health Endpoints
- `GET /health` — Service operational status, environment profile, version.
- `GET /actuator/health` — Spring Boot Actuator health metric.

### Authentication Endpoints (`/auth`)
- `POST /auth/register` — Body: `{ name, email, password }` -> Creates user & local identity, establishes session cookie (`KATASPHERE_SESSION`).
- `POST /auth/login` — Body: `{ email, password, rememberMe }` -> Verifies BCrypt hash, establishes session cookie.
- `POST /auth/logout` — Invalidates session and clears security context.
- `GET /auth/me` — Returns current authenticated user (`UserDto`) or `401 Unauthorized`.

### User Endpoints (`/users`)
- `GET /users/me` — Authenticated profile endpoint returning account metadata.

### Problem Library Endpoints (`/problems`, `/tags`)
- `GET /problems` — Supports query params:
  - `difficulty`: `EASY`, `MEDIUM`, `HARD`
  - `tag`: Tag slug (e.g. `array`, `hash-table`, `two-pointers`)
  - `search`: Substring search on problem title
  - `page`: Page index (default 0)
  - `size`: Page size (default 20)
  - `sortBy`: `title`, `difficulty`, `createdAt`
  - `sortDir`: `asc`, `desc`
- `GET /problems/{slug}` — Retrieves full problem statement, constraints, tags, and sample examples.
- `GET /tags` — Lists all available topic tags.

### Extensible Problem Administration (`/admin/problems`)
- `POST /admin/problems` — Body: `CreateProblemRequest`. Creates or updates problem, auto-creates tags, and generates missing language starter templates.
- `POST /admin/problems/batch` — Bulk imports problem arrays.

---

## 6. How Questions are Extensible

To add new coding challenges in the future, Katasphere provides 3 distinct paths:
1. **Web Problem Builder (`/problems/new`)**: Accessible directly in the UI. Enter title, difficulty, tags, description, constraints, and test cases. Publishing automatically saves it to PostgreSQL and makes it available in the catalog.
2. **Declarative JSON Catalog (`problems/catalog.json`)**: Place new questions in `backend/src/main/resources/problems/catalog.json`. On backend boot, `ProblemDataInitializer` validates and upserts them automatically.
3. **Programmatic REST API (`POST /api/v1/admin/problems/batch`)**: Ingest hundreds of problems from external scripts or datasets in a single API call.

---

## 7. Key Features Implemented

1. **Authentication & Session Security**:
   - Complete registration and login validation.
   - Case-insensitive email normalization.
   - Passwords securely hashed with BCrypt.
   - HttpOnly `KATASPHERE_SESSION` cookies with CORS origin controls.
2. **Protected Developer Dashboard**:
   - `/dashboard` is strictly protected: unauthenticated users are redirected to `/login?redirect=/dashboard`.
   - Navbar dynamically adapts: shows public links when logged out, and dashboard + user avatar dropdown when logged in.
3. **Dark & Light Mode**:
   - Full CSS variable palette in `globals.css` with Google Fonts (`Inter` for UI typography and `JetBrains Mono` for code).
   - High-contrast, accessible text and badge styling across both light and dark themes.
   - `ThemeToggle` in navbar with persistent `localStorage` preference.
4. **Live Problem Catalog**:
   - Server-side Spring Data JPA Specification search and filtering.
   - Filter chips for topics and difficulty levels.
   - Real-time catalog with 10+ seeded popular LeetCode-style katas.
5. **Coding Workspace (`/problems/[slug]`)**:
   - Split-pane layout with statement, examples, and constraints on the left.
   - Multi-language tabs (Python, Java, C++, JavaScript) with starter templates on the right.
   - Sample testcase runner tabs and result console.
6. **Interview Preparation Hub (`/interview-prep`)**:
   - Blind 75 pattern roadmap.
   - Top Interview 150 comprehensive roadmap.
   - Big Tech company tracks (Google, Meta, Amazon).
   - Technical interview strategy tips.

---

## 8. Local Setup & Startup Instructions

### Starting Local Database (Docker Compose)
```bash
cd /Users/hrishii/Desktop/katasphere
docker compose up -d
```

### Running Backend (Spring Boot)
```bash
cd /Users/hrishii/Desktop/katasphere/backend
# For local PostgreSQL:
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run

# For Supabase PostgreSQL:
SPRING_PROFILES_ACTIVE=supabase ./mvnw spring-boot:run
```
*Backend runs at `http://localhost:8080`.*

### Running Frontend (Next.js)
```bash
cd /Users/hrishii/Desktop/katasphere/frontend
npm run dev
```
*Frontend runs at `http://localhost:3000`.*

### Running Tests
- Backend test suite: `cd backend && ./mvnw test`
- Frontend production build: `cd frontend && npm run build`

### Deploying Backend to Render
1. In Render Dashboard, click **New +** -> **Web Service** -> Connect `hrishu22/Katasphere`.
2. **Root Directory**: `backend` *(do NOT use backend/src)*.
3. **Environment**: `Java` (or `Docker`).
4. **Build Command**: `chmod +x mvnw && ./mvnw clean package -DskipTests`
5. **Start Command**: `java -Dserver.port=$PORT -Xmx384m -jar target/katasphere-backend.jar`
6. **Environment Variables**:
   - `SPRING_PROFILES_ACTIVE`: `supabase`
   - `SUPABASE_DB_URL`: `jdbc:postgresql://<host>:5432/postgres?sslmode=require`
   - `SUPABASE_DB_USERNAME`: `postgres`
   - `SUPABASE_DB_PASSWORD`: `<your-supabase-db-password>`
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app,http://localhost:3000`

---

## 9. Next Milestones & Roadmap

- **Milestone 5**: Judge0 Execution Provider Adapter, asynchronous submission queuing, output normalizer, verdict mapping (Accepted, Wrong Answer, Time Limit Exceeded, Compilation Error).
- **Milestone 6**: Persistent submission history, per-user solved problem tracking, live dashboard statistics.
- **Milestone 7**: Automated end-to-end testing, security audits, rate-limiting, and accessibility review.
- **Milestone 8**: Production deployment to Vercel (frontend), Render (backend), and Supabase (database).
