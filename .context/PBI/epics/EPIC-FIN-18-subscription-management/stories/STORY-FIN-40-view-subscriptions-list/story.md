# Ver Lista de Suscripciones

**Jira Key:** FIN-40
**Epic:** FIN-18 (Gestion de Suscripciones)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver la lista de mis suscripciones activas con monto y proxima fecha de cobro
**So that** pueda planificar mis gastos recurrentes

---

## Description

Implementar vista de lista de suscripciones activas ordenadas por proxima fecha de cobro.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver lista de suscripciones (Happy Path)

```gherkin
Given tengo suscripciones activas
When navego a "/subscriptions"
Then debo ver lista de suscripciones
And cada una debe mostrar nombre, monto, frecuencia y proxima fecha
And deben ordenarse por proxima fecha de cobro
```

### Scenario 2: Indicador de proximidad (UX)

```gherkin
Given tengo suscripcion con cobro en 3 dias
When veo la lista
Then esa suscripcion debe tener indicador destacado
```

### Scenario 3: Sin suscripciones (Edge Case)

```gherkin
Given no tengo suscripciones
When navego a suscripciones
Then debo ver "No tienes suscripciones registradas"
And debo ver boton "Agregar suscripcion"
```

---

## Technical Notes

### Backend

**API Route:** `GET /api/subscriptions`

**Query Parameters:**

- `status`: 'active' | 'cancelled' | 'all'

---

## Dependencies

### Blocked By

- FIN-39: Registrar suscripcion

### Blocks

- FIN-23: Dashboard proximos cargos

---

## Definition of Done

- [ ] Lista implementada
- [ ] Ordenamiento por fecha
- [ ] Indicadores de proximidad
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-18-subscription-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-028)

---

_Document created: 2025-01-25_
