# Katasphere — Practice. Improve. Repeat.

A modern, production-minded online coding practice platform inspired by the developer-first experience of LeetCode and HackerRank. Katasphere empowers engineers to solve algorithmic problems, execute solutions across Java, Python, C++, and JavaScript in isolated environments via Judge0, validate against comprehensive test suites, and track technical interview preparation progress.

---

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS, Lucide React.
- **Backend**: Java 17 LTS / Java 21, Spring Boot 3.3.4, Spring Security, Spring Data JPA, Bean Validation, PostgreSQL driver, Flyway migrations, Spring Boot Actuator, JUnit 5.
- **Database**: PostgreSQL 16 (via Docker locally or Supabase in cloud) with Flyway migrations.
- **Code Execution**: Judge0 (invoked strictly by the backend; credentials never exposed to browser).
- **Deployment**: Vercel (Frontend), Render / Container (Backend), Supabase (PostgreSQL).

---

## Project Structure

```text
katasphere/
├── .github/
│   └── workflows/
│       └── ci.yml               # CI build & test pipeline for backend & frontend
├── backend/
│   ├── mvnw                     # Maven wrapper script
│   ├── pom.xml                  # Maven build & dependencies (Spring Boot 3.3.4)
│   ├── .env.example             # Backend environment template
│   └── src/
│       ├── main/
│           ├── java/com/katasphere/
│           │   ├── KatasphereApplication.java
│           │   ├── common/      # API response wrappers & exception handler
│           │   ├── config/      # Security, CORS, Web configuration
│           │   └── health/      # /api/v1/health operational endpoint
│           └── resources/
│               ├── application.yml
│               ├── application-local.yml
│               ├── application-supabase.yml
│               ├── application-prod.yml
│               └── db/migration/
│                   └── V1__create_users_and_auth_identities.sql
│       └── test/
│           ├── java/com/katasphere/
│           │   ├── KatasphereApplicationTests.java
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
- **PostgreSQL / Supabase**: Local Docker Compose or Supabase Cloud
- **Git**

---

### Step 1: Start the Local Database

If using local Docker Compose:
```bash
docker compose up -d
```
*(Or use Supabase Cloud as described below).*

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

## Supabase PostgreSQL Configuration

1. Create a project in [Supabase](https://supabase.com).
2. Retrieve your database connection string under **Project Settings -> Database -> Connection string (URI / JDBC)**.
3. In `backend/.env`, set:
   - `SPRING_PROFILES_ACTIVE=supabase`
   - `DB_URL=jdbc:postgresql://<project-ref>.supabase.co:5432/postgres?sslmode=require`
   - `DB_USERNAME=postgres`
   - `DB_PASSWORD=<your-supabase-db-password>`
4. Flyway will automatically apply migrations (`V1__create_users_and_auth_identities.sql` onwards) upon application startup.
