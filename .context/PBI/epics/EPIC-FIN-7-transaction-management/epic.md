# Gestion de Transacciones (Gastos e Ingresos)

**Jira Key:** FIN-7
**Status:** To Do
**Priority:** P0 (CRITICAL)
**Phase:** Foundation (Sprint 1-2)
**Estimated Points:** 18

---

## Epic Description

Permitir a los usuarios registrar, categorizar y visualizar sus transacciones financieras. Esta es la funcionalidad core de la aplicacion, permitiendo trackear gastos e ingresos con categorias predefinidas.

**Business Value:**

Esta epica habilita la razon principal de usar Finora:

- Registro rapido de gastos (objetivo: menos de 10 segundos)
- Registro de ingresos con fuente opcional
- Historial de transacciones paginado y ordenado
- Filtros por tipo, categoria y rango de fechas
- 10 categorias predefinidas con iconos y colores

---

## User Stories

| #   | Jira Key   | Summary                             | Points | Priority | FR Ref |
| --- | ---------- | ----------------------------------- | ------ | -------- | ------ |
| 2.1 | **FIN-8**  | Registrar un gasto                  | 3      | High     | FR-006 |
| 2.2 | **FIN-9**  | Registrar un ingreso                | 2      | High     | FR-007 |
| 2.3 | **FIN-10** | Ver lista de transacciones          | 3      | High     | FR-008 |
| 2.4 | **FIN-11** | Filtrar transacciones               | 3      | Medium   | FR-009 |
| 2.5 | **FIN-12** | Editar transaccion existente        | 3      | Medium   | FR-010 |
| 2.6 | **FIN-13** | Eliminar transaccion                | 2      | Medium   | FR-011 |
| 2.7 | **FIN-14** | Categorias predefinidas para gastos | 2      | High     | FR-012 |

---

## Scope

### In Scope

- Registrar gastos con monto, categoria, descripcion, fecha
- Registrar ingresos con monto, fuente, descripcion, fecha
- Listar transacciones paginadas (20 por defecto, max 100)
- Ordenar por fecha descendente
- Filtrar por tipo (ingreso/gasto), categoria, rango de fechas
- Editar transacciones existentes (solo propias - RLS)
- Eliminar transacciones (hard delete)
- 10 categorias predefinidas con iconos

### Out of Scope (Future)

- Categorias personalizadas
- Transacciones recurrentes automaticas
- Importacion desde bancos
- Exportacion CSV/PDF
- Busqueda por descripcion

---

## Predefined Categories

| ID  | Name            | Icon            | Color   |
| --- | --------------- | --------------- | ------- |
| 1   | Alimentacion    | utensils        | #F59E0B |
| 2   | Transporte      | car             | #3B82F6 |
| 3   | Entretenimiento | film            | #8B5CF6 |
| 4   | Salud           | heart           | #EF4444 |
| 5   | Educacion       | book            | #10B981 |
| 6   | Hogar           | home            | #6366F1 |
| 7   | Ropa            | shirt           | #EC4899 |
| 8   | Tecnologia      | laptop          | #6B7280 |
| 9   | Servicios       | zap             | #F97316 |
| 10  | Otros           | more-horizontal | #9CA3AF |

---

## Acceptance Criteria (Epic Level)

1. Usuario puede registrar un gasto en menos de 10 segundos
2. Usuario puede registrar un ingreso con fuente opcional
3. Usuario puede ver historial paginado de transacciones (20 por pagina)
4. Usuario puede filtrar por tipo, categoria y fechas
5. Usuario puede editar y eliminar sus propias transacciones
6. Categorias predefinidas disponibles con iconos y colores
7. Balance se actualiza automaticamente con cada transaccion

---

## Related Functional Requirements

- **FR-006:** Record Expense
- **FR-007:** Record Income
- **FR-008:** List Transactions
- **FR-009:** Filter Transactions
- **FR-010:** Edit Transaction
- **FR-011:** Delete Transaction
- **FR-012:** Predefined Categories

See: `.context/SRS/functional-specs.md`

---

## Technical Considerations

### Database Schema

**Tabla: transactions**

- `id` (uuid, PK)
- `user_id` (uuid, FK -> auth.users)
- `type` (enum: 'income' | 'expense')
- `amount` (decimal 12,2)
- `category_id` (uuid, FK -> categories, nullable for income)
- `description` (varchar 255, nullable)
- `source` (varchar 100, nullable, for income)
- `date` (date)
- `created_at`, `updated_at`

**Tabla: categories**

- `id` (uuid, PK)
- `name` (varchar 50)
- `icon` (varchar 50)
- `color` (varchar 7, hex color)

**Indices:**

- `idx_tx_user_date` (user_id, date DESC)
- `idx_tx_user_type` (user_id, type)

### API Endpoints

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------- |
| GET    | /api/transactions     | List with pagination and filters |
| POST   | /api/transactions     | Create expense or income         |
| GET    | /api/transactions/:id | Get single transaction           |
| PATCH  | /api/transactions/:id | Update transaction               |
| DELETE | /api/transactions/:id | Delete transaction               |
| GET    | /api/categories       | List all categories              |

### Security Requirements

- RLS: Users can only CRUD their own transactions
- Validation: amount > 0, amount <= 999999999.99
- Validation: date <= today (no future dates)
- Category must exist for expenses

---

## Dependencies

### External Dependencies

- Supabase Database

### Internal Dependencies

- EPIC-FIN-001: Authentication (requires logged in user)

### Blocks

- EPIC-FIN-006: Dashboard (stories 6.1, 6.2, 6.6)

---

## Success Metrics

### Functional Metrics

- Transaction creation time < 10 seconds
- API response time < 200ms (p50)
- 100% test coverage on critical paths

### Business Metrics

- Average transactions per user per month: 15+
- Users with 5+ transactions in week 1: 40%

---

## Testing Strategy

### Test Coverage Requirements

- **Unit Tests:** Zod schemas, utility functions, formatters
- **Integration Tests:** API routes with Supabase (mocked)
- **E2E Tests:** Full CRUD flows with Playwright

### Critical Test Scenarios

1. Registro de gasto con todos los campos
2. Registro de gasto con campos minimos
3. Registro de ingreso con/sin fuente
4. Listado paginado de transacciones
5. Filtros individuales y combinados
6. Edicion de transaccion propia
7. Intento de editar transaccion ajena (403)
8. Eliminacion con confirmacion
9. Validaciones de monto y fecha

---

## Implementation Plan

### Recommended Story Order

1. **FIN-14** - Categorias predefinidas (foundation)
2. **FIN-8** - Registrar gasto (core)
3. **FIN-9** - Registrar ingreso (core)
4. **FIN-10** - Ver lista de transacciones
5. **FIN-11** - Filtrar transacciones
6. **FIN-12** - Editar transaccion
7. **FIN-13** - Eliminar transaccion

### Estimated Effort

- **Development:** 1.5 sprints (3 weeks)
- **Testing:** 0.5 sprint (1 week)
- **Total:** 2 sprints

---

## Related Documentation

- **PRD:** `.context/PRD/mvp-scope.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-006 to FR-012)
- **Architecture:** `.context/SRS/architecture-specs.md`
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

_Document created: 2025-01-24_
