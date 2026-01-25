# Ver Comparativa Mes Actual vs Anterior

**Jira Key:** FIN-24
**Epic:** FIN-15 (Dashboard y Reportes)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver una comparativa de gastos entre el mes actual y el anterior
**So that** pueda identificar tendencias en mis finanzas

---

## Description

Implementar widget que compara gastos del mes actual vs mes anterior. Muestra variacion numerica y porcentual con indicador visual de aumento/disminucion.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Gastos aumentaron (Trend Up)

```gherkin
Given gaste $3000 el mes pasado
And he gastado $3500 este mes
When veo el dashboard
Then debo ver "Gastos vs mes anterior"
And debo ver "+$500 (+16.7%)"
And el indicador debe ser rojo con flecha hacia arriba
```

### Scenario 2: Gastos disminuyeron (Trend Down)

```gherkin
Given gaste $3000 el mes pasado
And he gastado $2500 este mes
When veo el dashboard
Then debo ver "-$500 (-16.7%)"
And el indicador debe ser verde con flecha hacia abajo
```

### Scenario 3: Sin datos del mes anterior (Edge Case)

```gherkin
Given es mi primer mes usando la app
And no tengo datos del mes anterior
When veo el dashboard
Then debo ver "Sin datos del mes anterior para comparar"
```

---

## Technical Notes

### Frontend

- **Componente:** `MonthComparisonCard.tsx` en `/src/components/dashboard/`

**data-testid:**

- `month-comparison-card` - Widget
- `comparison-difference` - Diferencia numerica
- `comparison-percentage` - Porcentaje
- `comparison-trend` - Indicador de tendencia

### Backend

**API Route:** `GET /api/dashboard/comparison`

**Response:**

```json
{
  "success": true,
  "data": {
    "current_month": {
      "period": "2025-01",
      "expenses": 3500.0
    },
    "previous_month": {
      "period": "2024-12",
      "expenses": 3000.0
    },
    "difference": 500.0,
    "percentage_change": 16.7,
    "trend": "up"
  }
}
```

---

## Dependencies

### Blocked By

- FIN-19: Balance mensual (comparte logica)
- FIN-8: Registrar gasto (necesita datos historicos)

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Widget de comparativa implementado
- [ ] Calculo de porcentaje correcto
- [ ] Indicadores visuales de tendencia
- [ ] Estado sin datos previos
- [ ] Tests E2E (3 scenarios)
- [ ] Code review aprobado

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-15-dashboard-reports/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-038)

---

_Document created: 2025-01-25_
