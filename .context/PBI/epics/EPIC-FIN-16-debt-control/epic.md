# Control de Deudas

**Jira Key:** FIN-16
**Status:** To Do
**Priority:** P1 (HIGH)
**Phase:** Core Features (Sprint 3-4)
**Estimated Points:** 18

---

## Epic Description

Permitir a los usuarios registrar deudas, trackear pagos parciales y visualizar el progreso de pago. Incluye historial de pagos y marcado de deudas como completadas.

**Business Value:**

Esta epica permite a los usuarios:

- Registrar deudas con monto total, acreedor, fecha de vencimiento
- Registrar pagos parciales para actualizar el saldo
- Ver historial completo de pagos realizados
- Visualizar lista de deudas activas con saldo pendiente
- Marcar deudas como pagadas cuando se liquida el total
- Editar y eliminar deudas registradas

---

## User Stories

| #   | Jira Key   | Summary                     | Points | Priority | FR Ref |
| --- | ---------- | --------------------------- | ------ | -------- | ------ |
| 3.1 | **FIN-25** | Registrar una deuda         | 3      | High     | FR-013 |
| 3.2 | **FIN-26** | Registrar un pago parcial   | 3      | High     | FR-014 |
| 3.3 | **FIN-27** | Ver historial de pagos      | 2      | Medium   | FR-015 |
| 3.4 | **FIN-28** | Ver lista de deudas activas | 3      | High     | FR-016 |
| 3.5 | **FIN-29** | Marcar deuda como pagada    | 2      | Medium   | FR-017 |
| 3.6 | **FIN-30** | Editar datos de una deuda   | 3      | Medium   | FR-018 |
| 3.7 | **FIN-31** | Eliminar una deuda          | 2      | Low      | FR-019 |

---

## Scope

### In Scope

- Registrar deudas con monto, acreedor, fecha vencimiento, descripcion
- Registrar pagos parciales que actualizan saldo pendiente
- Ver historial de pagos por deuda
- Listar deudas activas ordenadas por vencimiento
- Marcar deudas como pagadas (manual o automatico)
- Editar y eliminar deudas propias

### Out of Scope (Future)

- Recordatorios de pagos
- Integracion con bancos para pagos
- Calculadora de intereses
- Consolidacion de deudas
- Reportes de deudas historicas

---

## Acceptance Criteria (Epic Level)

1. Usuario puede registrar una deuda con todos los campos requeridos
2. Usuario puede registrar pagos parciales que reducen el saldo
3. Usuario puede ver el historial de pagos de cada deuda
4. Usuario puede ver lista de deudas ordenadas por proximo vencimiento
5. Deuda se marca automaticamente como pagada cuando saldo = 0
6. Usuario puede editar y eliminar sus propias deudas

---

## Related Functional Requirements

- **FR-013:** Register Debt
- **FR-014:** Register Partial Payment
- **FR-015:** View Payment History
- **FR-016:** List Active Debts
- **FR-017:** Mark Debt as Paid
- **FR-018:** Edit Debt
- **FR-019:** Delete Debt

See: `.context/SRS/functional-specs.md`

---

## Technical Considerations

### Database Schema

**Tabla: debts**

- `id` (uuid, PK)
- `user_id` (uuid, FK -> auth.users)
- `creditor` (varchar 100, required)
- `total_amount` (decimal 12,2)
- `remaining_amount` (decimal 12,2)
- `due_date` (date)
- `description` (varchar 255, nullable)
- `status` (enum: 'active' | 'paid')
- `created_at`, `updated_at`

**Tabla: debt_payments**

- `id` (uuid, PK)
- `debt_id` (uuid, FK -> debts)
- `amount` (decimal 12,2)
- `payment_date` (date)
- `notes` (varchar 255, nullable)
- `created_at`

**Indices:**

- `idx_debts_user_status` (user_id, status)
- `idx_debts_user_due` (user_id, due_date)

### API Endpoints

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | /api/debts              | List user debts with filters  |
| POST   | /api/debts              | Create new debt               |
| GET    | /api/debts/:id          | Get single debt with payments |
| PATCH  | /api/debts/:id          | Update debt                   |
| DELETE | /api/debts/:id          | Delete debt                   |
| POST   | /api/debts/:id/payments | Add payment to debt           |
| GET    | /api/debts/:id/payments | Get payment history           |

### Security Requirements

- RLS: Users can only CRUD their own debts
- Validation: amount > 0, amount <= 999999999.99
- Validation: due_date can be past or future
- Payment cannot exceed remaining amount

---

## Dependencies

### External Dependencies

- Supabase Database

### Internal Dependencies

- EPIC-FIN-1: Authentication (requires logged in user)

### Blocks

- EPIC-FIN-15: Dashboard (story FIN-21)

---

## Success Metrics

### Functional Metrics

- Debt creation time < 15 seconds
- API response time < 200ms (p50)
- 100% test coverage on critical paths

### Business Metrics

- 30%+ users with at least 1 debt registered
- Average 2+ payments registered per debt

---

## Testing Strategy

### Test Coverage Requirements

- **Unit Tests:** Zod schemas, payment calculations
- **Integration Tests:** API routes with Supabase (mocked)
- **E2E Tests:** Full debt lifecycle with Playwright

### Critical Test Scenarios

1. Registro de deuda con todos los campos
2. Registro de pago parcial actualiza saldo
3. Registro de pago total marca deuda como pagada
4. Historial de pagos muestra todos los pagos
5. Lista de deudas filtrada por estado
6. Edicion de deuda propia
7. Intento de pago mayor al saldo (error)
8. Eliminacion con confirmacion

---

## Implementation Plan

### Recommended Story Order

1. **FIN-25** - Registrar deuda (foundation)
2. **FIN-28** - Ver lista de deudas
3. **FIN-26** - Registrar pago parcial
4. **FIN-27** - Ver historial de pagos
5. **FIN-29** - Marcar deuda como pagada
6. **FIN-30** - Editar deuda
7. **FIN-31** - Eliminar deuda

### Estimated Effort

- **Development:** 1.5 sprints (3 weeks)
- **Testing:** 0.5 sprint (1 week)
- **Total:** 2 sprints

---

## Related Documentation

- **PRD:** `.context/PRD/mvp-scope.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-013 to FR-019)
- **Architecture:** `.context/SRS/architecture-specs.md`
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

_Document created: 2025-01-25_
