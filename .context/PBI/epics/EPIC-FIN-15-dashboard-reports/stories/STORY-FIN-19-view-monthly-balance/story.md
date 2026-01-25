# Ver Balance Mensual

**Jira Key:** FIN-19
**Epic:** FIN-15 (Dashboard y Reportes)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver mi balance mensual (ingresos - gastos)
**So that** pueda entender mi situacion financiera actual

---

## Description

Implementar el widget de balance mensual en el dashboard que muestra: total de ingresos del mes, total de gastos del mes, y la diferencia (balance). Incluye indicador visual de si el balance es positivo o negativo.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver balance mensual positivo (Happy Path)

```gherkin
Given estoy autenticado
And tengo ingresos de $5000 este mes
And tengo gastos de $3000 este mes
When navego al dashboard
Then debo ver el widget de balance mensual
And debo ver "Ingresos: $5,000.00"
And debo ver "Gastos: $3,000.00"
And debo ver "Balance: $2,000.00"
And el balance debe mostrarse en verde (positivo)
```

### Scenario 2: Ver balance mensual negativo (Edge Case)

```gherkin
Given tengo ingresos de $2000 este mes
And tengo gastos de $3500 este mes
When veo el dashboard
Then debo ver "Balance: -$1,500.00"
And el balance debe mostrarse en rojo (negativo)
```

### Scenario 3: Balance cero cuando no hay transacciones (Edge Case)

```gherkin
Given no tengo transacciones este mes
When veo el dashboard
Then debo ver "Ingresos: $0.00"
And debo ver "Gastos: $0.00"
And debo ver "Balance: $0.00"
```

### Scenario 4: Cambio de mes actualiza balance (Happy Path)

```gherkin
Given estoy viendo el balance del mes actual
When cambio al mes anterior usando el selector
Then el balance debe actualizarse con datos del mes seleccionado
```

---

## Technical Notes

### Frontend

- **Componente:** `BalanceCard.tsx` en `/src/components/dashboard/`
- **Ubicacion:** Dashboard principal, prominente
- **Estado:** TanStack Query con periodo como parametro

**data-testid:**

- `balance-card` - Widget de balance
- `balance-income` - Total ingresos
- `balance-expenses` - Total gastos
- `balance-total` - Balance neto
- `balance-month-selector` - Selector de mes

### Backend

**API Route:** `GET /api/dashboard/balance`

**Query Parameters:**

- `month`: YYYY-MM (default: mes actual)

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "2025-01",
    "income": 5000.0,
    "expenses": 3000.0,
    "balance": 2000.0
  }
}
```

---

## Dependencies

### Blocked By

- EPIC-FIN-7: Transactions (necesita datos de transacciones)
- FIN-8, FIN-9: Gastos e ingresos registrados

### Blocks

- FIN-24: Comparativa mensual (usa datos de balance)

---

## Definition of Done

- [ ] Widget de balance implementado
- [ ] API endpoint funcionando
- [ ] Colores segun signo del balance
- [ ] Selector de mes
- [ ] Tests E2E (4 scenarios)
- [ ] Code review aprobado

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-15-dashboard-reports/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-033)

---

_Document created: 2025-01-25_
