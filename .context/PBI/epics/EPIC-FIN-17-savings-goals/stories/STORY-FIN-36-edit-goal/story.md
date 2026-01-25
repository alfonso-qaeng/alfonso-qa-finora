# Editar Meta

**Jira Key:** FIN-36
**Epic:** FIN-17 (Metas de Ahorro)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** editar una meta (nombre, monto, fecha)
**So that** pueda ajustar mis objetivos segun cambien mis necesidades

---

## Description

Implementar edicion de metas existentes. Se puede cambiar nombre, monto objetivo y fecha limite. El progreso se recalcula si cambia el monto objetivo.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Editar nombre (Happy Path)

```gherkin
Given tengo una meta "Vacaciones"
When edito el nombre a "Vacaciones Europa"
And guardo
Then el nombre debe actualizarse
```

### Scenario 2: Editar monto recalcula progreso (Happy Path)

```gherkin
Given tengo meta de $1000 con $500 ahorrados (50%)
When cambio monto objetivo a $2000
Then el progreso debe recalcularse a 25%
```

### Scenario 3: RLS - No puede editar meta ajena (Security)

```gherkin
Given existe meta de otro usuario
When intento editarla via API
Then debo recibir error 403 Forbidden
```

---

## Technical Notes

### Backend

**API Route:** `PATCH /api/goals/:id`

---

## Dependencies

### Blocked By

- FIN-32: Crear meta
- FIN-35: Ver lista de metas

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Edicion funcionando
- [ ] Recalculo de progreso
- [ ] RLS verificado
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-17-savings-goals/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-024)

---

_Document created: 2025-01-25_
