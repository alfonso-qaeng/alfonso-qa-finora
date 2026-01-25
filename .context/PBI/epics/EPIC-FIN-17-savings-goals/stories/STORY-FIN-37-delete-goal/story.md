# Eliminar Meta

**Jira Key:** FIN-37
**Epic:** FIN-17 (Metas de Ahorro)
**Priority:** Low
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** eliminar una meta que ya no es relevante
**So that** pueda mantener mi lista de metas limpia

---

## Description

Implementar eliminacion de metas con confirmacion. Eliminar una meta tambien elimina su historial de aportaciones (cascade delete).

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Eliminar con confirmacion (Happy Path)

```gherkin
Given tengo una meta que quiero eliminar
When hago clic en eliminar
Then debo ver dialogo de confirmacion
When confirmo
Then la meta y sus aportaciones deben eliminarse
```

### Scenario 2: Cancelar eliminacion (Happy Path)

```gherkin
Given veo dialogo de confirmacion
When cancelo
Then la meta debe permanecer
```

### Scenario 3: RLS (Security)

```gherkin
Given existe meta de otro usuario
When intento eliminarla
Then debo recibir error 403 Forbidden
```

---

## Technical Notes

### Backend

**API Route:** `DELETE /api/goals/:id`

Cascade delete de goal_contributions.

---

## Dependencies

### Blocked By

- FIN-32: Crear meta
- FIN-35: Ver lista

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Eliminacion con confirmacion
- [ ] Cascade delete
- [ ] RLS verificado
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-17-savings-goals/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-025)

---

_Document created: 2025-01-25_
