# Ver Progreso de Metas de Ahorro

**Jira Key:** FIN-22
**Epic:** FIN-15 (Dashboard y Reportes)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver el progreso de mis metas de ahorro en el dashboard
**So that** pueda mantenerme motivado a ahorrar

---

## Description

Implementar widget que muestra mini-cards con progreso de metas de ahorro activas. Cada card muestra nombre, barra de progreso, porcentaje y monto actual vs objetivo.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver metas con progreso (Happy Path)

```gherkin
Given estoy autenticado
And tengo 2 metas de ahorro activas
When navego al dashboard
Then debo ver mini-cards de cada meta
And cada card debe mostrar nombre, barra de progreso y porcentaje
```

### Scenario 2: Progreso visual correcto (Happy Path)

```gherkin
Given tengo una meta "Vacaciones" con objetivo $1000 y ahorrado $600
When veo el dashboard
Then la barra de progreso debe mostrar 60%
And debo ver "$600 / $1,000"
```

### Scenario 3: Sin metas activas (Edge Case)

```gherkin
Given no tengo metas de ahorro activas
When veo el dashboard
Then debo ver "No tienes metas de ahorro"
And debo ver boton "Crear meta"
```

---

## Technical Notes

### Frontend

- **Componente:** `GoalsProgressCard.tsx` en `/src/components/dashboard/`

**data-testid:**

- `goals-progress-card` - Contenedor
- `goal-mini-card` - Cada mini card
- `goal-progress-bar` - Barra de progreso
- `goals-empty` - Estado vacio

### Backend

**API Route:** `GET /api/dashboard/goals-progress`

**Response:**

```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": "uuid",
        "name": "Vacaciones",
        "target_amount": 1000.0,
        "current_amount": 600.0,
        "percentage": 60,
        "target_date": "2025-06-01"
      }
    ]
  }
}
```

---

## Dependencies

### Blocked By

- EPIC-FIN-17: Savings Goals (FIN-32 a FIN-38)

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Widget con mini-cards implementado
- [ ] Barras de progreso visuales
- [ ] Estado vacio con CTA
- [ ] Tests E2E (3 scenarios)
- [ ] Code review aprobado

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-15-dashboard-reports/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-036)

---

_Document created: 2025-01-25_
