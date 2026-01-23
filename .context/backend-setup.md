# Backend Setup - Finora

## Resumen

| Aspecto        | Valor                                    |
| -------------- | ---------------------------------------- |
| **Database**   | Supabase PostgreSQL 17.6                 |
| **Project ID** | `zmofqoilerozqoyabsid`                   |
| **Region**     | us-east-2                                |
| **URL**        | https://zmofqoilerozqoyabsid.supabase.co |
| **Tablas**     | 8                                        |
| **ENUMs**      | 5                                        |

---

## Schema de Base de Datos

### ERD (Entity Relationship Diagram)

```
auth.users (Supabase Auth)
    │
    ├── profiles (1:1)
    │
    ├── transactions (1:N) ──► categories (N:1)
    │
    ├── debts (1:N)
    │       └── debt_payments (1:N)
    │
    ├── goals (1:N)
    │       └── goal_contributions (1:N)
    │
    └── subscriptions (1:N)
```

### Tablas

#### 1. `categories` - Catálogo de categorías

| Columna    | Tipo         | Nullable | Default           | Descripción           |
| ---------- | ------------ | -------- | ----------------- | --------------------- |
| id         | UUID         | NO       | gen_random_uuid() | PK                    |
| name       | VARCHAR(100) | NO       | -                 | Nombre único          |
| icon       | VARCHAR(50)  | NO       | -                 | Icono Lucide          |
| color      | VARCHAR(7)   | NO       | -                 | Color hex             |
| is_system  | BOOLEAN      | NO       | true              | Categoría del sistema |
| created_at | TIMESTAMPTZ  | NO       | now()             | Fecha creación        |

**10 categorías predefinidas:** Alimentación, Transporte, Entretenimiento, Salud, Educación, Hogar, Ropa, Tecnología, Servicios, Otros

#### 2. `profiles` - Perfiles de usuario

| Columna         | Tipo         | Nullable | Default           | Descripción              |
| --------------- | ------------ | -------- | ----------------- | ------------------------ |
| id              | UUID         | NO       | gen_random_uuid() | PK                       |
| user_id         | UUID         | NO       | -                 | FK → auth.users (UNIQUE) |
| name            | VARCHAR(100) | YES      | NULL              | Nombre del usuario       |
| currency_symbol | VARCHAR(5)   | NO       | '$'               | Símbolo de moneda        |
| created_at      | TIMESTAMPTZ  | NO       | now()             | Fecha creación           |
| updated_at      | TIMESTAMPTZ  | NO       | now()             | Última actualización     |

#### 3. `transactions` - Transacciones financieras

| Columna     | Tipo             | Nullable | Default           | Descripción               |
| ----------- | ---------------- | -------- | ----------------- | ------------------------- |
| id          | UUID             | NO       | gen_random_uuid() | PK                        |
| user_id     | UUID             | NO       | -                 | FK → auth.users           |
| type        | transaction_type | NO       | -                 | 'income' \| 'expense'     |
| amount      | DECIMAL(12,2)    | NO       | -                 | Monto (>0, ≤999999999.99) |
| category_id | UUID             | YES      | NULL              | FK → categories           |
| source      | VARCHAR(100)     | YES      | NULL              | Origen (para ingresos)    |
| description | VARCHAR(255)     | YES      | NULL              | Descripción               |
| date        | DATE             | NO       | CURRENT_DATE      | Fecha transacción         |
| created_at  | TIMESTAMPTZ      | NO       | now()             | Fecha creación            |
| updated_at  | TIMESTAMPTZ      | NO       | now()             | Última actualización      |

#### 4. `debts` - Deudas

| Columna      | Tipo          | Nullable | Default           | Descripción               |
| ------------ | ------------- | -------- | ----------------- | ------------------------- |
| id           | UUID          | NO       | gen_random_uuid() | PK                        |
| user_id      | UUID          | NO       | -                 | FK → auth.users           |
| total_amount | DECIMAL(12,2) | NO       | -                 | Monto total (>0)          |
| paid_amount  | DECIMAL(12,2) | NO       | 0                 | Monto pagado (≥0, ≤total) |
| creditor     | VARCHAR(100)  | NO       | -                 | Nombre del acreedor       |
| description  | VARCHAR(255)  | YES      | NULL              | Descripción               |
| due_date     | DATE          | YES      | NULL              | Fecha vencimiento         |
| status       | debt_status   | NO       | 'active'          | 'active' \| 'paid'        |
| created_at   | TIMESTAMPTZ   | NO       | now()             | Fecha creación            |
| updated_at   | TIMESTAMPTZ   | NO       | now()             | Última actualización      |

#### 5. `debt_payments` - Pagos de deudas

| Columna    | Tipo          | Nullable | Default           | Descripción          |
| ---------- | ------------- | -------- | ----------------- | -------------------- |
| id         | UUID          | NO       | gen_random_uuid() | PK                   |
| debt_id    | UUID          | NO       | -                 | FK → debts (CASCADE) |
| amount     | DECIMAL(12,2) | NO       | -                 | Monto del pago (>0)  |
| date       | DATE          | NO       | CURRENT_DATE      | Fecha del pago       |
| note       | VARCHAR(255)  | YES      | NULL              | Nota opcional        |
| created_at | TIMESTAMPTZ   | NO       | now()             | Fecha creación       |

#### 6. `goals` - Metas de ahorro

| Columna        | Tipo          | Nullable | Default           | Descripción             |
| -------------- | ------------- | -------- | ----------------- | ----------------------- |
| id             | UUID          | NO       | gen_random_uuid() | PK                      |
| user_id        | UUID          | NO       | -                 | FK → auth.users         |
| name           | VARCHAR(100)  | NO       | -                 | Nombre de la meta       |
| target_amount  | DECIMAL(12,2) | NO       | -                 | Monto objetivo (>0)     |
| current_amount | DECIMAL(12,2) | NO       | 0                 | Monto actual (≥0)       |
| target_date    | DATE          | YES      | NULL              | Fecha objetivo          |
| description    | VARCHAR(255)  | YES      | NULL              | Descripción             |
| status         | goal_status   | NO       | 'active'          | 'active' \| 'completed' |
| created_at     | TIMESTAMPTZ   | NO       | now()             | Fecha creación          |
| completed_at   | TIMESTAMPTZ   | YES      | NULL              | Fecha completado        |

#### 7. `goal_contributions` - Aportaciones a metas

| Columna    | Tipo          | Nullable | Default           | Descripción           |
| ---------- | ------------- | -------- | ----------------- | --------------------- |
| id         | UUID          | NO       | gen_random_uuid() | PK                    |
| goal_id    | UUID          | NO       | -                 | FK → goals (CASCADE)  |
| amount     | DECIMAL(12,2) | NO       | -                 | Monto aportación (>0) |
| date       | DATE          | NO       | CURRENT_DATE      | Fecha aportación      |
| note       | VARCHAR(255)  | YES      | NULL              | Nota opcional         |
| created_at | TIMESTAMPTZ   | NO       | now()             | Fecha creación        |

#### 8. `subscriptions` - Suscripciones recurrentes

| Columna           | Tipo                   | Nullable | Default           | Descripción             |
| ----------------- | ---------------------- | -------- | ----------------- | ----------------------- |
| id                | UUID                   | NO       | gen_random_uuid() | PK                      |
| user_id           | UUID                   | NO       | -                 | FK → auth.users         |
| name              | VARCHAR(100)           | NO       | -                 | Nombre del servicio     |
| amount            | DECIMAL(12,2)          | NO       | -                 | Monto (>0)              |
| frequency         | subscription_frequency | NO       | -                 | 'monthly' \| 'yearly'   |
| next_billing_date | DATE                   | NO       | -                 | Próximo cobro           |
| description       | VARCHAR(255)           | YES      | NULL              | Descripción             |
| status            | subscription_status    | NO       | 'active'          | 'active' \| 'cancelled' |
| created_at        | TIMESTAMPTZ            | NO       | now()             | Fecha creación          |
| cancelled_at      | TIMESTAMPTZ            | YES      | NULL              | Fecha cancelación       |

### ENUMs

```sql
transaction_type: 'income' | 'expense'
debt_status: 'active' | 'paid'
goal_status: 'active' | 'completed'
subscription_frequency: 'monthly' | 'yearly'
subscription_status: 'active' | 'cancelled'
```

### Índices

| Tabla              | Índice                         | Columnas             | Propósito               |
| ------------------ | ------------------------------ | -------------------- | ----------------------- |
| profiles           | idx_profiles_user_id           | (user_id)            | Búsqueda por usuario    |
| transactions       | idx_transactions_user_date     | (user_id, date DESC) | Listado por fecha       |
| transactions       | idx_transactions_user_type     | (user_id, type)      | Filtro por tipo         |
| transactions       | idx_transactions_category      | (category_id)        | Filtro por categoría    |
| debts              | idx_debts_user_status          | (user_id, status)    | Deudas activas          |
| debts              | idx_debts_due_date             | (due_date)           | Ordenar por vencimiento |
| debt_payments      | idx_debt_payments_debt_id      | (debt_id)            | Historial de pagos      |
| goals              | idx_goals_user_status          | (user_id, status)    | Metas activas           |
| goal_contributions | idx_goal_contributions_goal_id | (goal_id)            | Historial aportaciones  |
| subscriptions      | idx_subscriptions_user_status  | (user_id, status)    | Suscripciones activas   |
| subscriptions      | idx_subscriptions_billing      | (next_billing_date)  | Próximos cobros         |

---

## Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con las siguientes políticas:

### categories

- **SELECT:** Todos los usuarios autenticados pueden leer

### profiles, transactions, debts, goals, subscriptions

- **SELECT:** Solo el propietario (`auth.uid() = user_id`)
- **INSERT:** Solo puede insertar con su propio `user_id`
- **UPDATE:** Solo el propietario puede actualizar
- **DELETE:** Solo el propietario puede eliminar

### debt_payments, goal_contributions

- **SELECT/INSERT/DELETE:** Acceso basado en propiedad de la entidad padre (debt/goal)

---

## Autenticación

- **Provider:** Supabase Auth (JWT)
- **Método:** Email/Password
- **Token expiry:** 1 hora (access), 7 días (refresh)

---

## Archivos de Configuración

### Variables de Entorno

```
src/lib/config.ts    # Configuración centralizada
```

Variables requeridas en `.env`:

- `SUPABASE_URL` - URL del proyecto
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key (cliente)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (servidor)

### Supabase Clients

```
src/lib/supabase/client.ts   # Browser client
src/lib/supabase/server.ts   # Server client (Next.js 15+)
```

### Tipos TypeScript

```
src/types/supabase.ts    # Auto-generados desde el schema
```

---

## Comandos Útiles

### Regenerar tipos TypeScript

```bash
npx supabase gen types typescript --project-id zmofqoilerozqoyabsid > src/types/supabase.ts
```

### Ver migraciones

```bash
# Usando MCP Supabase
mcp__supabase__list_migrations
```

### Verificar seguridad

```bash
# Usando MCP Supabase
mcp__supabase__get_advisors (type: security)
```

---

## Troubleshooting

### Error: Missing environment variable

- Verificar que `.env` existe y tiene las variables correctas
- Reiniciar el servidor de desarrollo después de cambiar `.env`

### Error: RLS policy violation

- Verificar que el usuario está autenticado
- Verificar que `user_id` coincide con `auth.uid()`

### Error: Foreign key constraint

- Verificar que las referencias (category_id, debt_id, goal_id) existen
- Las categorías deben existir antes de crear transacciones

---

## Próximos Pasos

1. **Frontend Setup:** Ejecutar `.prompts/fase-3-infrastructure/frontend-setup.md`
2. **Implementar Auth UI:** Login, Register, Forgot Password
3. **Conectar páginas:** Dashboard, Transactions, etc.
