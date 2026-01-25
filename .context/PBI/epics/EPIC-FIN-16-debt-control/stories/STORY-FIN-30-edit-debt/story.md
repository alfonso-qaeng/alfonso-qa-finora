# Editar Datos de una Deuda

**Jira Key:** FIN-30
**Epic:** FIN-16 (Control de Deudas)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** editar los datos de una deuda
**So that** pueda corregir informacion incorrecta

---

## Description

Implementar edicion de deudas existentes. Se puede editar: acreedor, monto total, fecha de vencimiento, descripcion. El saldo pendiente se recalcula si cambia el monto total.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Editar acreedor (Happy Path)

```gherkin
Given tengo una deuda con acreedor "Banco ABC"
When edito el acreedor a "Banco XYZ"
And guardo cambios
Then el acreedor debe actualizarse
```

### Scenario 2: Editar monto total (Happy Path)

```gherkin
Given tengo deuda de $5000 con $1000 pagados (saldo $4000)
When cambio monto total a $6000
Then el saldo pendiente debe recalcularse a $5000
```

### Scenario 3: RLS - No puede editar deuda ajena (Security)

```gherkin
Given existe una deuda de otro usuario
When intento editarla via API
Then debo recibir error 403 Forbidden
```

---

## Technical Notes

### Backend

**API Route:** `PATCH /api/debts/:id`

**Request:**

```json
{
  "creditor": "Nuevo acreedor",
  "total_amount": 6000.0,
  "due_date": "2025-07-01",
  "description": "Nueva descripcion"
}
```

---

## Dependencies

### Blocked By

- FIN-25: Registrar deuda
- FIN-28: Ver lista de deudas

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Edicion funcionando
- [ ] Recalculo de saldo pendiente
- [ ] RLS verificado
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-16-debt-control/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-018)

---

_Document created: 2025-01-25_
