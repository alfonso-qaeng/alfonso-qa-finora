# Marcar Suscripcion como Cancelada

**Jira Key:** FIN-42
**Epic:** FIN-18 (Gestion de Suscripciones)
**Priority:** Medium
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** marcar una suscripcion como cancelada
**So that** pueda actualizar mi lista de suscripciones activas

---

## Description

Implementar marcado de suscripciones como canceladas (soft delete). La suscripcion permanece para historial pero no cuenta en totales ni proximos cargos.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Cancelar suscripcion (Happy Path)

```gherkin
Given tengo suscripcion activa "Netflix"
When hago clic en "Cancelar suscripcion"
And confirmo
Then el estado debe cambiar a "cancelled"
And no debe aparecer en suscripciones activas
And no debe contar en total mensual
```

### Scenario 2: Ver historial de canceladas (Happy Path)

```gherkin
Given tengo suscripciones canceladas
When filtro por "Canceladas"
Then debo ver mis suscripciones anteriores
And cada una debe mostrar fecha de cancelacion
```

### Scenario 3: Reactivar suscripcion (Edge Case)

```gherkin
Given tengo suscripcion cancelada
When hago clic en "Reactivar"
Then debe volver a estado activo
And debo actualizar fecha de proximo cargo
```

---

## Technical Notes

### Backend

**API Route:** `POST /api/subscriptions/:id/cancel`

Sets status to 'cancelled' and cancelled_at timestamp.

---

## Dependencies

### Blocked By

- FIN-39: Registrar suscripcion
- FIN-40: Ver lista

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Cancelacion funcionando
- [ ] Historial de canceladas
- [ ] Reactivacion opcional
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-18-subscription-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-030)

---

_Document created: 2025-01-25_
