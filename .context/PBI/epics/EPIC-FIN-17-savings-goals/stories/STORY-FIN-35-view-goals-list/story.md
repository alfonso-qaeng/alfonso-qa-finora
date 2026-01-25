# Ver Lista de Metas

**Jira Key:** FIN-35
**Epic:** FIN-17 (Metas de Ahorro)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver la lista de mis metas con progreso actual
**So that** pueda tener visibilidad de todos mis objetivos de ahorro

---

## Description

Implementar vista de lista de metas con cards que muestran nombre, progreso visual, monto ahorrado y fecha limite.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver lista de metas (Happy Path)

```gherkin
Given tengo metas de ahorro activas
When navego a "/goals"
Then debo ver cards de cada meta
And cada card debe mostrar nombre, progreso y fecha
And deben ordenarse por progreso descendente
```

### Scenario 2: Filtrar por estado (Happy Path)

```gherkin
Given tengo metas activas y completadas
When selecciono filtro "Completadas"
Then solo debo ver metas completadas
```

### Scenario 3: Sin metas (Edge Case)

```gherkin
Given no tengo metas de ahorro
When navego a metas
Then debo ver "No tienes metas de ahorro"
And debo ver boton "Crear tu primera meta"
```

---

## Technical Notes

### Backend

**API Route:** `GET /api/goals`

**Query Parameters:**

- `status`: 'active' | 'completed' | 'all'

---

## Dependencies

### Blocked By

- FIN-32: Crear meta

### Blocks

- FIN-22: Dashboard progreso

---

## Definition of Done

- [ ] Lista de metas con cards
- [ ] Filtro por estado
- [ ] Ordenamiento
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-17-savings-goals/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-023)

---

_Document created: 2025-01-25_
