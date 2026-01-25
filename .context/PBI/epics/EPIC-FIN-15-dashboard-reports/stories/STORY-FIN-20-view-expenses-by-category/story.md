# Ver Gastos por Categoria

**Jira Key:** FIN-20
**Epic:** FIN-15 (Dashboard y Reportes)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver mis gastos agrupados por categoria
**So that** pueda identificar en que gasto mas dinero

---

## Description

Implementar grafico de dona/pie que muestra gastos del mes agrupados por categoria. Incluye porcentaje y monto por categoria. Permite identificar rapidamente las categorias con mayor gasto.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver grafico de gastos por categoria (Happy Path)

```gherkin
Given estoy autenticado
And tengo gastos en diferentes categorias este mes
When navego al dashboard
Then debo ver un grafico de dona con gastos por categoria
And cada segmento debe mostrar el color de la categoria
And debo ver la leyenda con nombre, monto y porcentaje
```

### Scenario 2: Ver porcentajes correctos (Happy Path)

```gherkin
Given tengo los siguientes gastos este mes:
  | Categoria       | Monto |
  | Alimentacion    | 500   |
  | Transporte      | 300   |
  | Entretenimiento | 200   |
When veo el grafico de gastos
Then "Alimentacion" debe mostrar 50%
And "Transporte" debe mostrar 30%
And "Entretenimiento" debe mostrar 20%
```

### Scenario 3: Sin gastos muestra estado vacio (Edge Case)

```gherkin
Given no tengo gastos este mes
When veo el dashboard
Then debo ver mensaje "No hay gastos este mes"
And el grafico no debe mostrarse
```

### Scenario 4: Hover muestra detalle (UX)

```gherkin
Given veo el grafico de gastos por categoria
When paso el cursor sobre el segmento "Alimentacion"
Then debo ver tooltip con "Alimentacion: $500.00 (50%)"
```

---

## Technical Notes

### Frontend

- **Componente:** `ExpensesByCategoryChart.tsx` en `/src/components/dashboard/`
- **Libreria:** Recharts (PieChart) o Chart.js (Doughnut)
- **Colores:** Usar colores de categorias

**data-testid:**

- `expenses-category-chart` - Grafico
- `expenses-category-legend` - Leyenda
- `expenses-category-empty` - Estado vacio

### Backend

**API Route:** `GET /api/dashboard/expenses-by-category`

**Query Parameters:**

- `month`: YYYY-MM (default: mes actual)

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "2025-01",
    "total": 1000.0,
    "categories": [
      {
        "category_id": "uuid",
        "name": "Alimentacion",
        "icon": "utensils",
        "color": "#F59E0B",
        "amount": 500.0,
        "percentage": 50
      }
    ]
  }
}
```

---

## Dependencies

### Blocked By

- FIN-8: Registrar gasto (necesita gastos)
- FIN-14: Categorias predefinidas

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Grafico de dona implementado
- [ ] Colores de categorias correctos
- [ ] Porcentajes calculados
- [ ] Tooltips funcionando
- [ ] Tests E2E (4 scenarios)
- [ ] Code review aprobado

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-15-dashboard-reports/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-034)

---

_Document created: 2025-01-25_
