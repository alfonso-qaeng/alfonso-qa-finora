# Gestion de Suscripciones

**Jira Key:** FIN-18
**Status:** To Do
**Priority:** P1 (HIGH)
**Phase:** Core Features (Sprint 5)
**Estimated Points:** 15

---

## Epic Description

Permitir a los usuarios registrar suscripciones recurrentes, ver proximos cargos y detectar gastos innecesarios. Calcula automaticamente el equivalente mensual para suscripciones anuales.

**Business Value:**

Esta epica permite a los usuarios:

- Registrar suscripciones con nombre, monto, frecuencia y fecha de cargo
- Ver lista de suscripciones activas con proxima fecha de cobro
- Calcular total mensual de gastos en suscripciones
- Marcar suscripciones como canceladas
- Editar y eliminar suscripciones
- Identificar gastos recurrentes innecesarios

---

## User Stories

| #   | Jira Key   | Summary                            | Points | Priority | FR Ref |
| --- | ---------- | ---------------------------------- | ------ | -------- | ------ |
| 5.1 | **FIN-39** | Registrar una suscripcion          | 3      | High     | FR-027 |
| 5.2 | **FIN-40** | Ver lista de suscripciones activas | 3      | High     | FR-028 |
| 5.3 | **FIN-41** | Ver total mensual de suscripciones | 2      | Medium   | FR-029 |
| 5.4 | **FIN-42** | Marcar suscripcion como cancelada  | 2      | Medium   | FR-030 |
| 5.5 | **FIN-43** | Editar datos de suscripcion        | 3      | Medium   | FR-031 |
| 5.6 | **FIN-44** | Eliminar suscripcion               | 2      | Low      | FR-032 |

---

## Scope

### In Scope

- Registrar suscripciones con nombre, monto, frecuencia, fecha de cargo
- Frecuencias soportadas: semanal, mensual, anual
- Calcular equivalente mensual (anual/12, semanal\*4)
- Lista de suscripciones ordenadas por proxima fecha de cobro
- Total mensual de todas las suscripciones activas
- Marcar suscripciones como canceladas (soft delete)
- Editar y eliminar suscripciones

### Out of Scope (Future)

- Deteccion automatica de suscripciones desde banco
- Recordatorios de proximos cobros
- Sugerencias de cancelacion
- Comparativa de precios
- Compartir suscripciones familiares

---

## Acceptance Criteria (Epic Level)

1. Usuario puede registrar suscripcion con todos los campos
2. Lista muestra suscripciones ordenadas por proxima fecha de cobro
3. Total mensual calcula correctamente equivalentes de todas las frecuencias
4. Usuario puede marcar suscripcion como cancelada
5. Usuario puede editar monto, frecuencia y fecha de suscripcion
6. Usuario puede eliminar suscripciones registradas por error

---

## Related Functional Requirements

- **FR-027:** Register Subscription
- **FR-028:** List Active Subscriptions
- **FR-029:** View Monthly Total
- **FR-030:** Cancel Subscription
- **FR-031:** Edit Subscription
- **FR-032:** Delete Subscription

See: `.context/SRS/functional-specs.md`

---

## Technical Considerations

### Database Schema

**Tabla: subscriptions**

- `id` (uuid, PK)
- `user_id` (uuid, FK -> auth.users)
- `name` (varchar 100, required)
- `amount` (decimal 12,2)
- `frequency` (enum: 'weekly' | 'monthly' | 'yearly')
- `next_charge_date` (date)
- `status` (enum: 'active' | 'cancelled')
- `cancelled_at` (timestamp, nullable)
- `created_at`, `updated_at`

**Calculated Fields (frontend/API):**

- `monthly_equivalent`: amount \* 4 (weekly), amount (monthly), amount / 12 (yearly)

**Indices:**

- `idx_subs_user_status` (user_id, status)
- `idx_subs_user_next_charge` (user_id, next_charge_date)

### API Endpoints

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| GET    | /api/subscriptions            | List user subscriptions |
| POST   | /api/subscriptions            | Create new subscription |
| GET    | /api/subscriptions/:id        | Get single subscription |
| PATCH  | /api/subscriptions/:id        | Update subscription     |
| DELETE | /api/subscriptions/:id        | Delete subscription     |
| POST   | /api/subscriptions/:id/cancel | Cancel subscription     |
| GET    | /api/subscriptions/summary    | Get monthly total       |

### Security Requirements

- RLS: Users can only CRUD their own subscriptions
- Validation: amount > 0, amount <= 999999.99
- Validation: next_charge_date can be past or future

---

## Dependencies

### External Dependencies

- Supabase Database

### Internal Dependencies

- EPIC-FIN-1: Authentication (requires logged in user)

### Blocks

- EPIC-FIN-15: Dashboard (story FIN-23)

---

## Success Metrics

### Functional Metrics

- Subscription creation time < 15 seconds
- API response time < 200ms (p50)
- 100% test coverage on critical paths

### Business Metrics

- 30%+ users with at least 1 subscription registered
- Average 3+ subscriptions per user
- Total mensual promedio visible en dashboard

---

## Testing Strategy

### Test Coverage Requirements

- **Unit Tests:** Zod schemas, monthly equivalent calculations
- **Integration Tests:** API routes with Supabase (mocked)
- **E2E Tests:** Full subscription lifecycle with Playwright

### Critical Test Scenarios

1. Registrar suscripcion mensual
2. Registrar suscripcion anual - verifica equivalente mensual
3. Registrar suscripcion semanal - verifica equivalente mensual
4. Lista ordenada por proxima fecha de cobro
5. Total mensual suma correctamente todas las frecuencias
6. Cancelar suscripcion cambia status
7. Editar monto y frecuencia
8. Eliminacion con confirmacion

---

## Implementation Plan

### Recommended Story Order

1. **FIN-39** - Registrar suscripcion (foundation)
2. **FIN-40** - Ver lista de suscripciones
3. **FIN-41** - Ver total mensual
4. **FIN-42** - Marcar como cancelada
5. **FIN-43** - Editar suscripcion
6. **FIN-44** - Eliminar suscripcion

### Estimated Effort

- **Development:** 1 sprint (2 weeks)
- **Testing:** 0.5 sprint (1 week)
- **Total:** 1.5 sprints

---

## Related Documentation

- **PRD:** `.context/PRD/mvp-scope.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-027 to FR-032)
- **Architecture:** `.context/SRS/architecture-specs.md`
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

_Document created: 2025-01-25_
