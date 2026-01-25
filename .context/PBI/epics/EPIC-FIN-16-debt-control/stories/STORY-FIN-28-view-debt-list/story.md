# Ver Lista de Deudas Activas

**Jira Key:** FIN-28
**Epic:** FIN-16 (Control de Deudas)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver la lista de mis deudas activas con saldo pendiente y proximo vencimiento
**So that** pueda tener visibilidad de todos mis compromisos financieros

---

## Description

Implementar vista de lista de deudas activas. Muestra acreedor, saldo pendiente, fecha de vencimiento y barra de progreso de pago. Ordenadas por proximidad de vencimiento.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver lista de deudas activas (Happy Path)

```gherkin
Given tengo deudas activas
When navego a la pagina de deudas "/debts"
Then debo ver lista de deudas activas
And cada deuda debe mostrar: acreedor, saldo pendiente, fecha vencimiento
And deben estar ordenadas por fecha de vencimiento (proxima primero)
```

### Scenario 2: Indicador de progreso (Happy Path)

```gherkin
Given tengo una deuda de $1000 con $600 pagados
When veo la lista
Then la barra de progreso debe mostrar 60%
```

### Scenario 3: Alerta de vencimiento proximo (Alert)

```gherkin
Given tengo una deuda que vence en 5 dias
When veo la lista
Then esa deuda debe tener indicador de alerta
```

### Scenario 4: Sin deudas activas (Edge Case)

```gherkin
Given no tengo deudas activas
When navego a deudas
Then debo ver "No tienes deudas activas"
And debo ver boton "Registrar deuda"
```

---

## Technical Notes

### Backend

**API Route:** `GET /api/debts`

**Query Parameters:**

- `status`: 'active' | 'paid' | 'all'

**Response:**

```json
{
  "success": true,
  "data": {
    "debts": [
      {
        "id": "uuid",
        "creditor": "Banco XYZ",
        "total_amount": 5000.0,
        "remaining_amount": 4000.0,
        "due_date": "2025-06-01",
        "status": "active",
        "progress_percentage": 20
      }
    ]
  }
}
```

---

## Dependencies

### Blocked By

- FIN-25: Registrar deuda

### Blocks

- FIN-21: Dashboard resumen de deudas

---

## Definition of Done

- [ ] Lista de deudas implementada
- [ ] Ordenamiento por vencimiento
- [ ] Indicadores de progreso y alerta
- [ ] Tests E2E (4 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-16-debt-control/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-016)

---

_Document created: 2025-01-25_
