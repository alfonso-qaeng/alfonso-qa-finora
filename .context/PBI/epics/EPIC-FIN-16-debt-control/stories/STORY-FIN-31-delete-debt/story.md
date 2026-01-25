# Eliminar una Deuda

**Jira Key:** FIN-31
**Epic:** FIN-16 (Control de Deudas)
**Priority:** Low
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** eliminar una deuda registrada por error
**So that** pueda mantener mi lista de deudas limpia

---

## Description

Implementar eliminacion de deudas. Requiere confirmacion. Eliminar una deuda tambien elimina su historial de pagos (cascade delete).

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Eliminar deuda con confirmacion (Happy Path)

```gherkin
Given tengo una deuda que quiero eliminar
When hago clic en eliminar
Then debo ver dialogo de confirmacion
And el dialogo debe advertir que se eliminara el historial de pagos
When confirmo
Then la deuda y sus pagos deben eliminarse
```

### Scenario 2: Cancelar eliminacion (Happy Path)

```gherkin
Given veo el dialogo de confirmacion
When cancelo
Then la deuda debe permanecer
```

### Scenario 3: RLS - No puede eliminar deuda ajena (Security)

```gherkin
Given existe una deuda de otro usuario
When intento eliminarla via API
Then debo recibir error 403 Forbidden
```

---

## Technical Notes

### Backend

**API Route:** `DELETE /api/debts/:id`

Cascade delete de debt_payments relacionados.

---

## Dependencies

### Blocked By

- FIN-25: Registrar deuda
- FIN-28: Ver lista de deudas

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Eliminacion con confirmacion
- [ ] Cascade delete de pagos
- [ ] RLS verificado
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-16-debt-control/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-019)

---

_Document created: 2025-01-25_
