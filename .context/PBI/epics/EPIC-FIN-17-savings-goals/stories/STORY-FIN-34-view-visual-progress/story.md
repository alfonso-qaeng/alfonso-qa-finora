# Ver Progreso Visual de Meta

**Jira Key:** FIN-34
**Epic:** FIN-17 (Metas de Ahorro)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver el progreso visual de mi meta (barra de progreso, porcentaje)
**So that** pueda motivarme a seguir ahorrando

---

## Description

Implementar visualizacion de progreso con barra de progreso y porcentaje. Muestra current_amount vs target_amount de forma visual y motivadora.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Progreso visual correcto (Happy Path)

```gherkin
Given tengo una meta de $1000 con $600 ahorrados
When veo el detalle de la meta
Then la barra de progreso debe mostrar 60%
And debo ver "$600 de $1,000 (60%)"
```

### Scenario 2: Progreso 0% (Edge Case)

```gherkin
Given tengo una meta recien creada con $0
When veo la meta
Then la barra debe estar vacia (0%)
And debo ver "$0 de $1,000 (0%)"
```

### Scenario 3: Progreso 100% completado (Happy Path)

```gherkin
Given tengo una meta completada
When veo la meta
Then la barra debe estar llena (100%)
And debo ver indicador de "Meta completada!"
And opcionalmente celebracion visual
```

---

## Technical Notes

### Frontend

**Componente:** `GoalProgressBar.tsx` con animacion

**data-testid:**

- `goal-progress-bar` - Barra de progreso
- `goal-progress-percentage` - Porcentaje
- `goal-progress-amount` - Montos

---

## Dependencies

### Blocked By

- FIN-32: Crear meta
- FIN-33: Registrar aportacion

### Blocks

- FIN-22: Dashboard progreso de metas

---

## Definition of Done

- [ ] Barra de progreso visual
- [ ] Porcentaje correcto
- [ ] Animaciones
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-17-savings-goals/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-022)

---

_Document created: 2025-01-25_
