# Eliminar Suscripcion

**Jira Key:** FIN-44
**Epic:** FIN-18 (Gestion de Suscripciones)
**Priority:** Low
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** eliminar una suscripcion registrada por error
**So that** pueda mantener mi lista limpia

---

## Description

Implementar eliminacion de suscripciones con confirmacion. Es un hard delete (no soft delete como cancelar).

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Eliminar con confirmacion (Happy Path)

```gherkin
Given tengo una suscripcion que registre por error
When hago clic en eliminar
Then debo ver dialogo de confirmacion
When confirmo
Then la suscripcion debe eliminarse permanentemente
```

### Scenario 2: Cancelar eliminacion (Happy Path)

```gherkin
Given veo dialogo de confirmacion
When cancelo
Then la suscripcion debe permanecer
```

### Scenario 3: RLS (Security)

```gherkin
Given existe suscripcion de otro usuario
When intento eliminarla
Then debo recibir error 403 Forbidden
```

---

## Technical Notes

### Backend

**API Route:** `DELETE /api/subscriptions/:id`

---

## Dependencies

### Blocked By

- FIN-39: Registrar suscripcion
- FIN-40: Ver lista

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Eliminacion con confirmacion
- [ ] RLS verificado
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-18-subscription-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-032)

---

_Document created: 2025-01-25_
