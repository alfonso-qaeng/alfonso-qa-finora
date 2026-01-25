# Ver Resumen de Deudas Activas

**Jira Key:** FIN-21
**Epic:** FIN-15 (Dashboard y Reportes)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver un resumen de mis deudas activas en el dashboard
**So that** no olvide mis compromisos financieros

---

## Description

Implementar widget que muestra resumen de deudas activas: numero de deudas, total pendiente, y proxima deuda a vencer. Incluye alerta visual si hay deudas vencidas.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver resumen de deudas (Happy Path)

```gherkin
Given estoy autenticado
And tengo 3 deudas activas con total pendiente de $2000
And la proxima vence el 2025-02-01
When navego al dashboard
Then debo ver el widget de deudas
And debo ver "3 deudas activas"
And debo ver "Total pendiente: $2,000.00"
And debo ver "Proxima: Deuda X - 2025-02-01"
```

### Scenario 2: Alerta de deuda vencida (Alert)

```gherkin
Given tengo una deuda con fecha de vencimiento pasada
When veo el dashboard
Then el widget de deudas debe mostrar alerta roja
And debo ver "1 deuda vencida"
```

### Scenario 3: Sin deudas activas (Edge Case)

```gherkin
Given no tengo deudas activas
When veo el dashboard
Then debo ver "No tienes deudas activas"
And opcionalmente un mensaje motivacional
```

---

## Technical Notes

### Frontend

- **Componente:** `DebtsSummaryCard.tsx` en `/src/components/dashboard/`

**data-testid:**

- `debts-summary-card` - Widget
- `debts-count` - Numero de deudas
- `debts-total` - Total pendiente
- `debts-next` - Proxima a vencer
- `debts-alert` - Alerta de vencida

### Backend

**API Route:** `GET /api/dashboard/debts-summary`

**Response:**

```json
{
  "success": true,
  "data": {
    "active_count": 3,
    "total_pending": 2000.0,
    "overdue_count": 0,
    "next_due": {
      "id": "uuid",
      "creditor": "Banco X",
      "remaining_amount": 500.0,
      "due_date": "2025-02-01"
    }
  }
}
```

---

## Dependencies

### Blocked By

- EPIC-FIN-16: Debt Control (FIN-25 a FIN-31)

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Widget de resumen implementado
- [ ] Alerta de deudas vencidas
- [ ] Estado vacio
- [ ] Tests E2E (3 scenarios)
- [ ] Code review aprobado

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-15-dashboard-reports/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-035)

---

_Document created: 2025-01-25_
