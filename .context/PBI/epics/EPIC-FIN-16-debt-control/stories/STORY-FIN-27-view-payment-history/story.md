# Ver Historial de Pagos de Deuda

**Jira Key:** FIN-27
**Epic:** FIN-16 (Control de Deudas)
**Priority:** Medium
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver el historial de pagos de una deuda
**So that** pueda revisar mi progreso y los pagos realizados

---

## Description

Implementar vista de historial de pagos para cada deuda. Muestra lista de pagos ordenados por fecha con monto, fecha y notas opcionales.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver historial con pagos (Happy Path)

```gherkin
Given tengo una deuda con 3 pagos realizados
When veo el detalle de la deuda
Then debo ver la lista de pagos ordenada por fecha
And cada pago debe mostrar monto, fecha y notas
```

### Scenario 2: Historial vacio (Edge Case)

```gherkin
Given tengo una deuda sin pagos registrados
When veo el detalle de la deuda
Then debo ver "No hay pagos registrados"
And debo ver boton "Registrar primer pago"
```

### Scenario 3: Totales acumulados (Happy Path)

```gherkin
Given tengo pagos de $500, $300 y $200
When veo el historial
Then debo ver "Total pagado: $1,000"
```

---

## Technical Notes

### Backend

**API Route:** `GET /api/debts/:id/payments`

**Response:**

```json
{
  "success": true,
  "data": {
    "debt_id": "uuid",
    "payments": [
      {
        "id": "uuid",
        "amount": 500.0,
        "payment_date": "2025-01-15",
        "notes": "Pago enero"
      }
    ],
    "total_paid": 1000.0
  }
}
```

---

## Dependencies

### Blocked By

- FIN-26: Registrar pagos

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Lista de pagos implementada
- [ ] Totales calculados
- [ ] Estado vacio
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-16-debt-control/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-015)

---

_Document created: 2025-01-25_
