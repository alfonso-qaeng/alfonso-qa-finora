# Marcar Meta como Completada

**Jira Key:** FIN-38
**Epic:** FIN-17 (Metas de Ahorro)
**Priority:** Medium
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** marcar una meta como completada cuando alcanzo el objetivo
**So that** pueda celebrar mi logro y ver mi historial de metas cumplidas

---

## Description

Implementar marcado de metas como completadas. Se puede hacer manualmente o automaticamente cuando current_amount >= target_amount.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Auto-completar (Happy Path)

```gherkin
Given tengo meta de $1000 con $950 ahorrados
When registro aportacion de $50 o mas
Then la meta debe marcarse automaticamente como completada
And debo ver celebracion visual
```

### Scenario 2: Marcar manualmente (Happy Path)

```gherkin
Given tengo una meta activa
When hago clic en "Marcar como completada"
And confirmo
Then la meta debe cambiar a estado "completed"
And completed_at debe registrarse
```

### Scenario 3: Lista de metas completadas (Happy Path)

```gherkin
Given tengo metas completadas
When filtro por "Completadas"
Then debo ver mis logros pasados
And cada una debe mostrar fecha de completado
```

---

## Technical Notes

### Backend

Auto-complete via trigger o logica en POST /contributions

**API Route:** `POST /api/goals/:id/complete` o `PATCH` con status

---

## Dependencies

### Blocked By

- FIN-32: Crear meta
- FIN-33: Registrar aportacion

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Auto-completar funcionando
- [ ] Marcado manual
- [ ] Celebracion visual
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-17-savings-goals/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-026)

---

_Document created: 2025-01-25_
