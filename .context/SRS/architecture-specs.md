# Architecture Specifications — Finora

> Arquitectura técnica del MVP

*Version: 1.0 | MVP | Fecha: Enero 2025*

---

## 1. System Architecture

### 1.1 C4 Level 1 — System Context

```mermaid
C4Context
    title System Context Diagram - Finora

    Person(user, "Usuario", "Persona que quiere gestionar sus finanzas personales")

    System(finora, "Finora", "Aplicación web de finanzas personales simplificadas")

    System_Ext(supabase_auth, "Supabase Auth", "Servicio de autenticación")
    System_Ext(email_service, "Email Service", "Envío de emails transaccionales")

    Rel(user, finora, "Usa", "HTTPS")
    Rel(finora, supabase_auth, "Autentica usuarios", "HTTPS")
    Rel(supabase_auth, email_service, "Envía emails de verificación", "SMTP")
```

### 1.2 C4 Level 2 — Container Diagram

```mermaid
C4Container
    title Container Diagram - Finora

    Person(user, "Usuario", "Persona que gestiona sus finanzas")

    Container_Boundary(finora_system, "Finora System") {
        Container(spa, "Web Application", "Next.js 15, React, TypeScript", "Interfaz de usuario SPA con SSR")
        Container(api, "API Routes", "Next.js API Routes", "API REST para operaciones CRUD")
        ContainerDb(db, "Database", "PostgreSQL", "Almacena datos de usuarios, transacciones, metas, deudas, suscripciones")
    }

    System_Ext(supabase, "Supabase", "BaaS: Auth + Database + Storage")
    System_Ext(vercel, "Vercel", "Hosting + Edge Network + CI/CD")

    Rel(user, spa, "Usa", "HTTPS")
    Rel(spa, api, "Consume", "HTTPS/JSON")
    Rel(api, supabase, "Queries", "Supabase Client")
    Rel(supabase, db, "Manages", "PostgreSQL Protocol")
    Rel(spa, vercel, "Deployed on", "")
    Rel(api, vercel, "Deployed on", "Serverless Functions")
```

### 1.3 Component Diagram — Frontend

```mermaid
flowchart TB
    subgraph Browser["Browser"]
        subgraph NextApp["Next.js 15 App"]
            AppRouter["App Router"]

            subgraph Pages["Pages (app/)"]
                AuthPages["Auth Pages<br/>/login, /register"]
                DashboardPage["Dashboard<br/>/dashboard"]
                TransactionsPage["Transactions<br/>/transactions"]
                DebtsPage["Debts<br/>/debts"]
                GoalsPage["Goals<br/>/goals"]
                SubscriptionsPage["Subscriptions<br/>/subscriptions"]
            end

            subgraph Components["Shared Components"]
                UIComponents["UI Components<br/>(Shadcn/ui)"]
                Forms["Form Components<br/>(React Hook Form + Zod)"]
                Charts["Chart Components<br/>(Recharts)"]
            end

            subgraph State["State Management"]
                TanStackQuery["TanStack Query<br/>(Server State)"]
                Zustand["Zustand<br/>(UI State)"]
            end
        end
    end

    AppRouter --> Pages
    Pages --> Components
    Pages --> State
    TanStackQuery --> API["API Routes"]
```

### 1.4 Component Diagram — Backend

```mermaid
flowchart TB
    subgraph API["Next.js API Routes (/api)"]
        subgraph AuthModule["Auth Module"]
            Register["/auth/register"]
            Login["/auth/login"]
            Logout["/auth/logout"]
            Profile["/auth/profile"]
        end

        subgraph TransactionsModule["Transactions Module"]
            ListTx["/transactions GET"]
            CreateTx["/transactions POST"]
            UpdateTx["/transactions/:id PATCH"]
            DeleteTx["/transactions/:id DELETE"]
        end

        subgraph DebtsModule["Debts Module"]
            ListDebts["/debts GET"]
            CreateDebt["/debts POST"]
            DebtPayments["/debts/:id/payments"]
        end

        subgraph GoalsModule["Goals Module"]
            ListGoals["/goals GET"]
            CreateGoal["/goals POST"]
            Contributions["/goals/:id/contributions"]
        end

        subgraph SubscriptionsModule["Subscriptions Module"]
            ListSubs["/subscriptions GET"]
            CreateSub["/subscriptions POST"]
            SubsSummary["/subscriptions/summary"]
        end

        subgraph DashboardModule["Dashboard Module"]
            Balance["/dashboard/balance"]
            ExpensesByCategory["/dashboard/expenses-by-category"]
            Comparison["/dashboard/comparison"]
        end
    end

    subgraph Middleware["Middleware Layer"]
        AuthMiddleware["Auth Middleware<br/>(JWT Validation)"]
        ValidationMiddleware["Validation Middleware<br/>(Zod Schemas)"]
    end

    subgraph Supabase["Supabase"]
        SupabaseClient["Supabase Client"]
        SupabaseAuth["Supabase Auth"]
        SupabaseDB["PostgreSQL + RLS"]
    end

    API --> Middleware
    Middleware --> SupabaseClient
    SupabaseClient --> SupabaseAuth
    SupabaseClient --> SupabaseDB
```

---

## 2. Database Design

### 2.1 Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ PROFILES : has
    USERS ||--o{ TRANSACTIONS : creates
    USERS ||--o{ DEBTS : creates
    USERS ||--o{ GOALS : creates
    USERS ||--o{ SUBSCRIPTIONS : creates

    CATEGORIES ||--o{ TRANSACTIONS : categorizes

    DEBTS ||--o{ DEBT_PAYMENTS : receives
    GOALS ||--o{ GOAL_CONTRIBUTIONS : receives

    USERS {
        uuid id PK
        string email UK
        timestamp created_at
        timestamp updated_at
    }

    PROFILES {
        uuid id PK
        uuid user_id FK
        string name
        string currency_symbol
        timestamp updated_at
    }

    CATEGORIES {
        uuid id PK
        string name
        string icon
        string color
        boolean is_system
    }

    TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        enum type "income|expense"
        decimal amount
        uuid category_id FK
        string source
        string description
        date date
        timestamp created_at
        timestamp updated_at
    }

    DEBTS {
        uuid id PK
        uuid user_id FK
        decimal total_amount
        decimal paid_amount
        string creditor
        string description
        date due_date
        enum status "active|paid"
        timestamp created_at
        timestamp updated_at
    }

    DEBT_PAYMENTS {
        uuid id PK
        uuid debt_id FK
        decimal amount
        date date
        string note
        timestamp created_at
    }

    GOALS {
        uuid id PK
        uuid user_id FK
        string name
        decimal target_amount
        decimal current_amount
        date target_date
        string description
        enum status "active|completed"
        timestamp created_at
        timestamp completed_at
    }

    GOAL_CONTRIBUTIONS {
        uuid id PK
        uuid goal_id FK
        decimal amount
        date date
        string note
        timestamp created_at
    }

    SUBSCRIPTIONS {
        uuid id PK
        uuid user_id FK
        string name
        decimal amount
        enum frequency "monthly|yearly"
        date next_billing_date
        string description
        enum status "active|cancelled"
        timestamp created_at
        timestamp cancelled_at
    }
```

### 2.2 Notas sobre Database Design

> **IMPORTANTE**: Este diagrama es conceptual. El schema real de la base de datos se obtiene en tiempo real usando el **Supabase MCP**.
>
> No generar SQL schemas estáticos. Usar Supabase Dashboard o MCP para crear y modificar tablas.

### 2.3 Índices Recomendados

| Tabla | Índice | Columnas | Justificación |
|-------|--------|----------|---------------|
| transactions | idx_tx_user_date | (user_id, date DESC) | Listados por usuario y fecha |
| transactions | idx_tx_user_type | (user_id, type) | Filtro por tipo |
| transactions | idx_tx_category | (category_id) | Filtro por categoría |
| debts | idx_debts_user_status | (user_id, status) | Listado de deudas activas |
| debts | idx_debts_due | (due_date) | Ordenar por vencimiento |
| goals | idx_goals_user_status | (user_id, status) | Listado de metas activas |
| subscriptions | idx_subs_user_status | (user_id, status) | Listado de suscripciones activas |
| subscriptions | idx_subs_billing | (next_billing_date) | Próximos cobros |

### 2.4 Row Level Security (RLS) Policies

```sql
-- Ejemplo de RLS policy para transactions
-- (Referencia, usar Supabase Dashboard para implementar)

-- Policy: Users can only see their own transactions
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can only insert their own transactions
CREATE POLICY "Users can insert own transactions"
ON transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own transactions
CREATE POLICY "Users can update own transactions"
ON transactions FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can only delete their own transactions
CREATE POLICY "Users can delete own transactions"
ON transactions FOR DELETE
USING (auth.uid() = user_id);
```

---

## 3. Tech Stack Justification

### 3.1 Frontend: Next.js 15 (App Router)

| Aspecto | Decisión |
|---------|----------|
| **Por qué elegido** | |
| ✅ | React Server Components para mejor performance inicial |
| ✅ | File-based routing simplifica estructura |
| ✅ | Full-stack framework (API routes integrados) |
| ✅ | Streaming y Suspense built-in |
| ✅ | Excelente DX y ecosistema maduro |
| **Trade-offs** | |
| ⚠️ | App Router relativamente nuevo (menos recursos legacy) |
| ⚠️ | Curva de aprendizaje vs Pages Router |

### 3.2 UI: TailwindCSS + Shadcn/ui

| Aspecto | Decisión |
|---------|----------|
| **Por qué elegido** | |
| ✅ | Utility-first CSS = desarrollo rápido |
| ✅ | Shadcn/ui = componentes accesibles y personalizables |
| ✅ | No vendor lock-in (código en tu repo) |
| ✅ | Consistencia visual automática |
| **Trade-offs** | |
| ⚠️ | HTML verboso con muchas clases |
| ⚠️ | Requiere conocer el sistema de Tailwind |

### 3.3 State Management: TanStack Query + Zustand

| Aspecto | Decisión |
|---------|----------|
| **Por qué elegido** | |
| ✅ | TanStack Query: caching inteligente de server state |
| ✅ | Zustand: UI state simple sin boilerplate |
| ✅ | Separación clara server vs client state |
| ✅ | Optimistic updates fáciles |
| **Trade-offs** | |
| ⚠️ | Dos librerías en vez de una (ej: Redux) |
| ⚠️ | Puede ser overkill para apps muy simples |

### 3.4 Validation: Zod

| Aspecto | Decisión |
|---------|----------|
| **Por qué elegido** | |
| ✅ | TypeScript-first, inferencia de tipos automática |
| ✅ | Mismos schemas en frontend y backend |
| ✅ | Integración perfecta con React Hook Form |
| ✅ | Mensajes de error personalizables |
| **Trade-offs** | |
| ⚠️ | Bundle size adicional (~12KB) |

### 3.5 Backend: Supabase

| Aspecto | Decisión |
|---------|----------|
| **Por qué elegido** | |
| ✅ | PostgreSQL completo (no NoSQL limitado) |
| ✅ | Auth built-in con múltiples providers |
| ✅ | Row Level Security (RLS) = seguridad en DB layer |
| ✅ | Realtime subscriptions (futuro) |
| ✅ | Free tier generoso para MVP |
| **Trade-offs** | |
| ⚠️ | Vendor lock-in (mitigado: PostgreSQL estándar) |
| ⚠️ | Menos control que infraestructura propia |

### 3.6 Hosting: Vercel

| Aspecto | Decisión |
|---------|----------|
| **Por qué elegido** | |
| ✅ | Zero-config deploy para Next.js |
| ✅ | Edge network global |
| ✅ | Preview deployments automáticos |
| ✅ | Analytics y Web Vitals integrados |
| **Trade-offs** | |
| ⚠️ | Costos pueden escalar con tráfico |
| ⚠️ | Vendor lock-in en algunas features |

### 3.7 Testing

| Tool | Uso | Justificación |
|------|-----|---------------|
| **Vitest** | Unit + Integration | Rápido, compatible con Vite, API similar a Jest |
| **Playwright** | E2E | Cross-browser, buena DX, assertions poderosas |
| **Postman/Newman** | API Testing | Standard de industria, collections compartibles |
| **axe-core** | Accessibility | Integración con CI, detecta issues WCAG |

---

## 4. Data Flow

### 4.1 User Registration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Route
    participant SA as Supabase Auth
    participant DB as PostgreSQL
    participant E as Email Service

    U->>F: Fill registration form
    F->>F: Client-side validation (Zod)
    F->>A: POST /api/auth/register
    A->>A: Server-side validation (Zod)
    A->>SA: supabase.auth.signUp()
    SA->>SA: Check email uniqueness
    SA->>SA: Hash password (bcrypt)
    SA->>DB: INSERT into auth.users
    SA->>E: Send verification email
    SA-->>A: Return user + session
    A->>DB: INSERT into profiles (via trigger or API)
    A-->>F: 201 Created + session
    F->>F: Store session (cookies)
    F-->>U: Redirect to dashboard
```

### 4.2 Create Transaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant Q as TanStack Query
    participant A as API Route
    participant M as Middleware
    participant S as Supabase Client
    participant DB as PostgreSQL

    U->>F: Fill transaction form
    F->>F: Validate with Zod
    F->>Q: mutate({ amount, category, ... })
    Q->>Q: Optimistic update (UI)
    Q->>A: POST /api/transactions
    A->>M: Validate JWT
    M->>M: Extract user_id from token
    A->>A: Validate request body (Zod)
    A->>S: supabase.from('transactions').insert()
    S->>DB: INSERT (RLS checks user_id)
    DB-->>S: Return new transaction
    S-->>A: Transaction created
    A-->>Q: 201 + transaction data
    Q->>Q: Update cache
    Q-->>F: Success
    F-->>U: Show success toast
```

### 4.3 Dashboard Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant Q as TanStack Query
    participant A as API Routes
    participant S as Supabase
    participant DB as PostgreSQL

    U->>F: Navigate to /dashboard
    F->>Q: useQueries([balance, expenses, goals, debts, subs])

    par Parallel Requests
        Q->>A: GET /dashboard/balance
        Q->>A: GET /dashboard/expenses-by-category
        Q->>A: GET /dashboard/goals-summary
        Q->>A: GET /dashboard/debts-summary
        Q->>A: GET /dashboard/upcoming-charges
    end

    A->>S: Multiple queries (parallel)
    S->>DB: SELECT with aggregations
    DB-->>S: Results
    S-->>A: Data
    A-->>Q: JSON responses
    Q->>Q: Cache all responses
    Q-->>F: Render dashboard
    F-->>U: Display complete dashboard
```

---

## 5. Security Architecture

### 5.1 Authentication Flow

```mermaid
flowchart TB
    subgraph Client["Client (Browser)"]
        LoginForm["Login Form"]
        Session["Session Storage<br/>(httpOnly cookies)"]
    end

    subgraph Server["Server (Next.js)"]
        Middleware["Auth Middleware"]
        APIRoutes["Protected API Routes"]
    end

    subgraph Supabase["Supabase"]
        Auth["Supabase Auth"]
        JWT["JWT Issuer"]
    end

    LoginForm -->|1. Credentials| Auth
    Auth -->|2. Validate| Auth
    Auth -->|3. Issue tokens| JWT
    JWT -->|4. access_token + refresh_token| Session
    Session -->|5. Include in requests| Middleware
    Middleware -->|6. Validate JWT| Auth
    Middleware -->|7. Extract user_id| APIRoutes
    APIRoutes -->|8. Query with user_id| Supabase
```

### 5.2 Authorization with RLS

```mermaid
flowchart LR
    subgraph Request["API Request"]
        Token["JWT Token"]
        Query["SELECT * FROM transactions"]
    end

    subgraph Supabase["Supabase"]
        Auth["Auth Middleware"]
        RLS["RLS Policy Check"]
        DB[(PostgreSQL)]
    end

    Token -->|1. Validate| Auth
    Auth -->|2. Extract user_id| RLS
    Query -->|3. Execute| RLS
    RLS -->|4. Add WHERE user_id = auth.uid()| DB
    DB -->|5. Return only user's data| RLS
```

### 5.3 Data Protection Layers

```mermaid
flowchart TB
    subgraph Layer1["Layer 1: Transport"]
        TLS["TLS 1.3<br/>HTTPS Only"]
    end

    subgraph Layer2["Layer 2: Application"]
        JWT["JWT Validation"]
        Zod["Input Validation (Zod)"]
        Sanitize["Output Sanitization"]
    end

    subgraph Layer3["Layer 3: Database"]
        RLS["Row Level Security"]
        Encrypt["Encryption at Rest"]
        Bcrypt["Password Hashing (bcrypt)"]
    end

    TLS --> JWT
    JWT --> Zod
    Zod --> Sanitize
    Sanitize --> RLS
    RLS --> Encrypt
    Encrypt --> Bcrypt
```

### 5.4 Security Checklist

| Área | Control | Implementación |
|------|---------|----------------|
| **Auth** | JWT validation | Supabase middleware |
| **Auth** | Token refresh | Automatic via Supabase |
| **Auth** | Session invalidation | Logout endpoint |
| **Authz** | Data isolation | RLS policies |
| **Input** | Validation | Zod schemas (client + server) |
| **Input** | SQL Injection | Parameterized queries (Supabase) |
| **Output** | XSS prevention | React auto-escaping |
| **Transport** | Encryption | HTTPS enforced |
| **Storage** | Encryption | Supabase managed (AES-256) |
| **Passwords** | Hashing | bcrypt via Supabase Auth |
| **Rate Limit** | Brute force | Login rate limiting |

---

## 6. Deployment Architecture

### 6.1 Infrastructure Diagram

```mermaid
flowchart TB
    subgraph Users["Users"]
        Browser["Browser"]
        Mobile["Mobile Browser"]
    end

    subgraph Vercel["Vercel (Hosting)"]
        Edge["Edge Network<br/>(CDN)"]
        Serverless["Serverless Functions<br/>(API Routes)"]
        Static["Static Assets<br/>(JS, CSS, Images)"]
    end

    subgraph Supabase["Supabase (Backend)"]
        Auth["Auth Service"]
        DB[(PostgreSQL)]
        Storage["Storage<br/>(future)"]
    end

    subgraph GitHub["GitHub"]
        Repo["Repository"]
        Actions["GitHub Actions<br/>(CI/CD)"]
    end

    Browser --> Edge
    Mobile --> Edge
    Edge --> Static
    Edge --> Serverless
    Serverless --> Auth
    Serverless --> DB

    Repo --> Actions
    Actions -->|Deploy| Vercel
```

### 6.2 CI/CD Pipeline

```mermaid
flowchart LR
    subgraph Trigger["Triggers"]
        Push["Push to branch"]
        PR["Pull Request"]
        Release["Release tag"]
    end

    subgraph CI["CI (GitHub Actions)"]
        Lint["Lint + Type Check"]
        Test["Run Tests"]
        Build["Build"]
        Audit["Security Audit"]
    end

    subgraph CD["CD (Vercel)"]
        Preview["Preview Deploy<br/>(PR branches)"]
        Staging["Staging Deploy<br/>(main branch)"]
        Prod["Production Deploy<br/>(release tags)"]
    end

    Push --> CI
    PR --> CI
    Release --> CI

    CI --> Preview
    CI --> Staging
    CI --> Prod
```

---

## 7. Monitoring & Observability

### 7.1 Monitoring Stack (MVP)

| Área | Tool | Métricas |
|------|------|----------|
| **Performance** | Vercel Analytics | LCP, FID, CLS, TTFB |
| **Errors** | Vercel Logs | API errors, build errors |
| **Database** | Supabase Dashboard | Query performance, connections |
| **Uptime** | Vercel Status | Service availability |

### 7.2 Future Monitoring (v2)

| Área | Tool | Propósito |
|------|------|-----------|
| **APM** | Sentry | Error tracking, performance |
| **Logs** | LogDNA/Datadog | Centralized logging |
| **Alerts** | PagerDuty | Incident management |
| **Analytics** | PostHog | Product analytics |

---

## 8. Appendix

### 8.1 Folder Structure

```
finora/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected routes group
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── debts/
│   │   ├── goals/
│   │   └── subscriptions/
│   ├── api/                 # API Routes
│   │   ├── auth/
│   │   ├── transactions/
│   │   ├── debts/
│   │   ├── goals/
│   │   ├── subscriptions/
│   │   └── dashboard/
│   ├── layout.tsx
│   └── page.tsx
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   ├── forms/               # Form components
│   ├── charts/              # Chart components
│   └── layout/              # Layout components
├── lib/                     # Utilities
│   ├── supabase/           # Supabase client
│   ├── validations/        # Zod schemas
│   └── utils/              # Helper functions
├── hooks/                   # Custom React hooks
├── stores/                  # Zustand stores
├── types/                   # TypeScript types
├── styles/                  # Global styles
├── public/                  # Static assets
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── .context/               # Documentation
    ├── PRD/
    └── SRS/
```

### 8.2 Environment Variables

```bash
# .env.local (never commit)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-only

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags (future)
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS=true
```

---

*Documento generado para: `.context/SRS/architecture-specs.md`*
*Última actualización: Enero 2025*
