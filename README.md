# CodeForge — Practice. Improve. Repeat.

A modern, production-minded online coding practice platform inspired by the developer-first experience of LeetCode and HackerRank. CodeForge empowers engineers to solve algorithmic problems, execute solutions across Java, Python, C++, and JavaScript in isolated environments via Judge0, validate against comprehensive test suites, and track technical interview preparation progress.

---

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS, Lucide React.
- **Backend**: Java 17 LTS / Java 21, Spring Boot 3.3.4, Spring Security, Spring Data JPA, Bean Validation, PostgreSQL driver, Flyway migrations, Spring Boot Actuator, JUnit 5.
- **Database**: PostgreSQL 16 (via Docker locally and Supabase in production) with Flyway migrations.
- **Code Execution**: Judge0 (invoked strictly by the backend; credentials never exposed to browser).
- **Deployment**: Vercel (Frontend), Render / Container (Backend), Supabase (PostgreSQL).

---

## Project Structure

```text
codeforge/
├── .github/
│   └── workflows/
│       └── ci.yml               # CI build & test pipeline for backend & frontend
├── backend/
│   ├── mvnw                     # Maven wrapper script
│   ├── pom.xml                  # Maven build & dependencies (Spring Boot 3.3.4)
│   ├── .env.example             # Backend environment template
│   └── src/
│       ├── main/
│           ├── java/com/codeforge/
│           │   ├── CodeforgeApplication.java
│           │   ├── common/      # API response wrappers & exception handler
│           │   ├── config/      # Security, CORS, Web configuration
│           │   └── health/      # /api/v1/health operational endpoint
│           └── resources/
│               ├── application.yml
│               ├── application-local.yml
│               ├── application-prod.yml
│               └── db/migration/
│                   └── V1__create_users_and_auth_identities.sql
│       └── test/
│           ├── java/com/codeforge/
│           │   ├── CodeforgeApplicationTests.java
│           │   └── health/HealthControllerTest.java
│           └── resources/
│               └── application-test.yml
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.mjs
│   ├── .env.example             # Frontend public environment template
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── globals.css
│       │   ├── page.tsx         # Public landing page
│       │   ├── dashboard/page.tsx
│       │   ├── problems/page.tsx
│       │   ├── login/page.tsx
│       │   ├── register/page.tsx
│       │   └── profile/page.tsx
│       ├── components/
│       │   └── layout/          # AppShell, Navbar, Footer
│       └── lib/
│           ├── api-client.ts    # Centralized typed HTTP client
│           └── utils.ts
├── infrastructure/
│   └── docker-compose.yml       # Local PostgreSQL 16 service
├── docker-compose.yml           # Root compose entrypoint
├── .env.example                 # Root environment template
├── .gitignore
└── README.md
```

---

## Local Development Setup

### Prerequisites

- **Java**: JDK 17 LTS or JDK 21
- **Node.js**: v20 or higher (v24 supported) and npm
- **Docker & Docker Compose**: For local PostgreSQL database
- **Git**

---

### Step 1: Start the Local Database

Start the PostgreSQL 16 container:

```bash
docker compose up -d
```

Verify that the container is healthy:

```bash
docker compose ps
```

The database will be accessible at:
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `codeforge`
- **User**: `codeforge_user`
- **Password**: `codeforge_local_password`

---

### Step 2: Configure Environment Variables

1. Copy the root environment template:
   ```bash
   cp .env.example .env
   ```
2. Copy the frontend template:
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```
3. Copy the backend template:
   ```bash
   cp backend/.env.example backend/.env
   ```

---

### Step 3: Run the Backend (Spring Boot)

```bash
cd backend
./mvnw clean spring-boot:run
```

The backend server starts at `http://localhost:8080`.

Verify health checks:
- **Application Health**: `curl http://localhost:8080/api/v1/health`
- **Actuator Health**: `curl http://localhost:8080/actuator/health`

Run tests:
```bash
./mvnw test
```

---

### Step 4: Run the Frontend (Next.js)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:3000`.

To run a production frontend build:
```bash
npm run build
```

---

## Database Configuration & Supabase Setup

### Local Development
Flyway migrations are executed automatically on startup. The schema is located in `backend/src/main/resources/db/migration/`.

### Supabase (Production)
1. Create a project in [Supabase](https://supabase.com).
2. Retrieve your database connection string under **Project Settings -> Database -> Connection string (URI)**.
3. Configure the following environment variables on your backend host (e.g. Render):
   - `SPRING_PROFILES_ACTIVE=prod`
   - `DB_URL=jdbc:postgresql://<project-ref>.supabase.co:5432/postgres?sslmode=require`
   - `DB_USERNAME=postgres`
   - `DB_PASSWORD=<your-supabase-db-password>`
4. Flyway will automatically apply migrations (`V1__create_users_and_auth_identities.sql` onwards) upon application startup.

---

## Milestone 1 Implementation Verification Status

- [x] **Repository & Scaffolding**: Modular monolith structure (`frontend/`, `backend/`, `infrastructure/`).
- [x] **Next.js Frontend Shell**: Next.js App Router, Tailwind dark theme, `AppShell`, `Navbar`, `Footer`, and `LandingPage`.
- [x] **Spring Boot Backend**: Spring Boot 3.3.4, Java 17/21 compatibility, Actuator, CORS, Security foundation.
- [x] **PostgreSQL Configuration**: Support for local Docker Compose and Supabase PostgreSQL with SSL.
- [x] **Flyway Initial Migration**: `V1__create_users_and_auth_identities.sql` with UUID primary keys and indices.
- [x] **Health Check Endpoints**: Verified operational at `GET /api/v1/health` and `/actuator/health`.
- [x] **Docker Compose**: PostgreSQL 16 container definition with health checks and persistence.
- [x] **Environment Variable Examples**: Safe templates without secrets (`.env.example`, `frontend/.env.example`, `backend/.env.example`).
- [x] **Local Startup Guide**: Complete instructions in `README.md`.
- [x] **Build & Test Verification**: Backend unit and integration tests passing (`2/2 tests passed`).
