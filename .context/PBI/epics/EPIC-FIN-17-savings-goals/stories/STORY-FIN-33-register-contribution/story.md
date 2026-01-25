# Registrar Aportacion a Meta

**Jira Key:** FIN-33
**Epic:** FIN-17 (Metas de Ahorro)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** registrar una aportacion a una meta
**So that** pueda incrementar mi ahorro hacia el objetivo

---

## Description

Implementar funcionalidad para registrar aportaciones a metas existentes. Cada aportacion incrementa el current_amount de la meta.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Registrar aportacion (Happy Path)

```gherkin
Given tengo una meta "Vacaciones" con $0 ahorrado
When registro una aportacion de $500
Then el monto ahorrado debe ser $500
And el progreso debe actualizarse
And debo ver mensaje "Aportacion registrada"
```

### Scenario 2: Aportacion completa la meta (Happy Path)

```gherkin
Given tengo una meta de $1000 con $900 ahorrados
When registro aportacion de $100 o mas
Then la meta debe marcarse como completada
And debo ver celebracion/confetti
```

### Scenario 3: Monto invalido (Error Case)

```gherkin
Given estoy registrando aportacion
When ingreso monto 0 o negativo
Then debo ver error "El monto debe ser mayor a 0"
```

---

## Technical Notes

### Backend

**API Route:** `POST /api/goals/:id/contributions`

**Request:**

```json
{
  "amount": 500.0,
  "contribution_date": "2025-01-25",
  "notes": "Ahorro de enero"
}
```

---

## Dependencies

### Blocked By

- FIN-32: Crear meta

### Blocks

- FIN-34: Ver progreso visual

---

## Definition of Done

- [ ] Registro de aportaciones
- [ ] Actualizacion de current_amount
- [ ] Auto-completar meta
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-17-savings-goals/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-021)

---

_Document created: 2025-01-25_
