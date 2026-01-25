# Metas de Ahorro

**Jira Key:** FIN-17
**Status:** To Do
**Priority:** P1 (HIGH)
**Phase:** Core Features (Sprint 4-5)
**Estimated Points:** 19

---

## Epic Description

Permitir a los usuarios crear metas de ahorro, registrar aportaciones y visualizar progreso con indicadores visuales (barras de progreso, porcentajes). Incluye gamificacion para motivar al usuario.

**Business Value:**

Esta epica permite a los usuarios:

- Crear metas de ahorro con nombre, monto objetivo y fecha limite
- Registrar aportaciones para incrementar el ahorro
- Ver progreso visual (barra de progreso, porcentaje)
- Visualizar lista de metas con progreso actual
- Editar y eliminar metas
- Celebrar logros cuando se completan metas

---

## User Stories

| #   | Jira Key   | Summary                     | Points | Priority | FR Ref |
| --- | ---------- | --------------------------- | ------ | -------- | ------ |
| 4.1 | **FIN-32** | Crear una meta de ahorro    | 3      | High     | FR-020 |
| 4.2 | **FIN-33** | Registrar una aportacion    | 3      | High     | FR-021 |
| 4.3 | **FIN-34** | Ver progreso visual de meta | 3      | High     | FR-022 |
| 4.4 | **FIN-35** | Ver lista de metas          | 3      | Medium   | FR-023 |
| 4.5 | **FIN-36** | Editar una meta             | 3      | Medium   | FR-024 |
| 4.6 | **FIN-37** | Eliminar una meta           | 2      | Low      | FR-025 |
| 4.7 | **FIN-38** | Marcar meta como completada | 2      | Medium   | FR-026 |

---

## Scope

### In Scope

- Crear metas con nombre, monto objetivo, fecha limite
- Registrar aportaciones con monto y fecha
- Barra de progreso visual (0-100%)
- Porcentaje de completado y monto faltante
- Lista de metas activas y completadas
- Editar nombre, monto y fecha de metas
- Eliminar metas no deseadas
- Marcar metas como completadas (manual o automatico)

### Out of Scope (Future)

- Aportaciones automaticas
- Integracion con cuentas de ahorro
- Compartir metas con otros usuarios
- Notificaciones de recordatorio
- Imagenes personalizadas para metas

---

## Acceptance Criteria (Epic Level)

1. Usuario puede crear una meta con nombre, monto y fecha
2. Usuario puede registrar aportaciones a cualquier meta
3. Progreso visual muestra barra y porcentaje actualizados
4. Lista muestra todas las metas ordenadas por progreso
5. Usuario puede editar nombre, monto y fecha de meta
6. Meta se marca automaticamente como completada cuando ahorro >= objetivo
7. Usuario puede celebrar logro cuando completa una meta

---

## Related Functional Requirements

- **FR-020:** Create Savings Goal
- **FR-021:** Register Contribution
- **FR-022:** View Visual Progress
- **FR-023:** List Savings Goals
- **FR-024:** Edit Savings Goal
- **FR-025:** Delete Savings Goal
- **FR-026:** Mark Goal as Completed

See: `.context/SRS/functional-specs.md`

---

## Technical Considerations

### Database Schema

**Tabla: savings_goals**

- `id` (uuid, PK)
- `user_id` (uuid, FK -> auth.users)
- `name` (varchar 100, required)
- `target_amount` (decimal 12,2)
- `current_amount` (decimal 12,2, default 0)
- `target_date` (date, nullable)
- `status` (enum: 'active' | 'completed')
- `completed_at` (timestamp, nullable)
- `created_at`, `updated_at`

**Tabla: goal_contributions**

- `id` (uuid, PK)
- `goal_id` (uuid, FK -> savings_goals)
- `amount` (decimal 12,2)
- `contribution_date` (date)
- `notes` (varchar 255, nullable)
- `created_at`

**Indices:**

- `idx_goals_user_status` (user_id, status)
- `idx_contributions_goal` (goal_id, contribution_date)

### API Endpoints

| Method | Endpoint                     | Description                        |
| ------ | ---------------------------- | ---------------------------------- |
| GET    | /api/goals                   | List user goals with progress      |
| POST   | /api/goals                   | Create new goal                    |
| GET    | /api/goals/:id               | Get single goal with contributions |
| PATCH  | /api/goals/:id               | Update goal                        |
| DELETE | /api/goals/:id               | Delete goal                        |
| POST   | /api/goals/:id/contributions | Add contribution                   |
| GET    | /api/goals/:id/contributions | Get contributions history          |

### Security Requirements

- RLS: Users can only CRUD their own goals
- Validation: amount > 0, amount <= 999999999.99
- Validation: target_date must be future when creating
- Contribution updates current_amount automatically

---

## Dependencies

### External Dependencies

- Supabase Database

### Internal Dependencies

- EPIC-FIN-1: Authentication (requires logged in user)

### Blocks

- EPIC-FIN-15: Dashboard (story FIN-22)

---

## Success Metrics

### Functional Metrics

- Goal creation time < 15 seconds
- API response time < 200ms (p50)
- 100% test coverage on critical paths

### Business Metrics

- 40%+ users with at least 1 goal created
- 50%+ goals with at least 1 contribution
- 20%+ goals completed

---

## Testing Strategy

### Test Coverage Requirements

- **Unit Tests:** Zod schemas, progress calculations
- **Integration Tests:** API routes with Supabase (mocked)
- **E2E Tests:** Full goal lifecycle with Playwright

### Critical Test Scenarios

1. Crear meta con todos los campos
2. Registrar aportacion actualiza current_amount
3. Barra de progreso muestra porcentaje correcto
4. Lista ordenada por progreso descendente
5. Edicion de meta propia
6. Meta se completa automaticamente al alcanzar objetivo
7. Eliminacion con confirmacion
8. Validacion de fechas futuras

---

## Implementation Plan

### Recommended Story Order

1. **FIN-32** - Crear meta de ahorro (foundation)
2. **FIN-35** - Ver lista de metas
3. **FIN-33** - Registrar aportacion
4. **FIN-34** - Ver progreso visual
5. **FIN-38** - Marcar meta completada
6. **FIN-36** - Editar meta
7. **FIN-37** - Eliminar meta

### Estimated Effort

- **Development:** 1.5 sprints (3 weeks)
- **Testing:** 0.5 sprint (1 week)
- **Total:** 2 sprints

---

## Related Documentation

- **PRD:** `.context/PRD/mvp-scope.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-020 to FR-026)
- **Architecture:** `.context/SRS/architecture-specs.md`
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

_Document created: 2025-01-25_
