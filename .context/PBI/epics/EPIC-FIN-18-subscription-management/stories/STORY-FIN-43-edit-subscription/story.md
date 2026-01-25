# Editar Suscripcion

**Jira Key:** FIN-43
**Epic:** FIN-18 (Gestion de Suscripciones)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** editar los datos de una suscripcion
**So that** pueda actualizar montos o fechas cuando cambian

---

## Description

Implementar edicion de suscripciones existentes. Se puede cambiar nombre, monto, frecuencia y fecha de proximo cargo.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Editar monto (Happy Path)

```gherkin
Given tengo suscripcion "Netflix" de $199
When edito el monto a $249
And guardo
Then el monto debe actualizarse
And el total mensual debe recalcularse
```

### Scenario 2: Editar frecuencia (Happy Path)

```gherkin
Given tengo suscripcion mensual de $100
When cambio a anual de $1000
Then el equivalente mensual debe recalcularse (~$83)
```

### Scenario 3: RLS (Security)

```gherkin
Given existe suscripcion de otro usuario
When intento editarla
Then debo recibir error 403 Forbidden
```

---

## Technical Notes

### Backend

**API Route:** `PATCH /api/subscriptions/:id`

---

## Dependencies

### Blocked By

- FIN-39: Registrar suscripcion
- FIN-40: Ver lista

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Edicion funcionando
- [ ] Recalculo de totales
- [ ] RLS verificado
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-18-subscription-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-031)

---

_Document created: 2025-01-25_
