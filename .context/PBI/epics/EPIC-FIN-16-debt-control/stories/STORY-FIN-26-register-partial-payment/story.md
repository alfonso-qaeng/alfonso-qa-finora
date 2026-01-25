# Registrar Pago Parcial a Deuda

**Jira Key:** FIN-26
**Epic:** FIN-16 (Control de Deudas)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** registrar un pago parcial a una deuda
**So that** pueda actualizar el saldo pendiente y ver mi progreso

---

## Description

Implementar funcionalidad para registrar pagos a deudas existentes. El pago reduce el saldo pendiente (remaining_amount). Si el pago cubre el saldo total, la deuda se marca como pagada automaticamente.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Registrar pago parcial (Happy Path)

```gherkin
Given tengo una deuda de $5000 con saldo pendiente de $5000
When registro un pago de $1000
Then el saldo pendiente debe actualizarse a $4000
And el pago debe aparecer en el historial
And la deuda debe seguir en estado "active"
```

### Scenario 2: Pago completa la deuda (Happy Path)

```gherkin
Given tengo una deuda con saldo pendiente de $500
When registro un pago de $500
Then el saldo pendiente debe ser $0
And la deuda debe cambiar a estado "paid"
And debo ver mensaje de felicitacion
```

### Scenario 3: Pago mayor al saldo (Error Case)

```gherkin
Given tengo una deuda con saldo pendiente de $500
When intento registrar un pago de $600
Then debo ver error "El pago no puede exceder el saldo pendiente ($500)"
```

---

## Technical Notes

### Frontend

**data-testid:**

- `payment-form` - Formulario de pago
- `payment-amount` - Input monto
- `payment-date` - Input fecha
- `payment-notes` - Input notas
- `payment-submit` - Boton registrar

### Backend

**API Route:** `POST /api/debts/:id/payments`

**Request:**

```json
{
  "amount": 1000.0,
  "payment_date": "2025-01-25",
  "notes": "Pago enero"
}
```

---

## Dependencies

### Blocked By

- FIN-25: Registrar deuda

### Blocks

- FIN-27: Ver historial de pagos

---

## Definition of Done

- [ ] Registro de pagos funcionando
- [ ] Actualizacion automatica de saldo
- [ ] Deuda se marca pagada cuando saldo = 0
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-16-debt-control/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-014)

---

_Document created: 2025-01-25_
