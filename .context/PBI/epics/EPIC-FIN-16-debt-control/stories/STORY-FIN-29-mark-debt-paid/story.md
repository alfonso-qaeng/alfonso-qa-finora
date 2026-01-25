# Marcar Deuda como Pagada

**Jira Key:** FIN-29
**Epic:** FIN-16 (Control de Deudas)
**Priority:** Medium
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** marcar una deuda como pagada cuando liquido el saldo total
**So that** pueda mantener mi lista de deudas actualizada

---

## Description

Implementar funcionalidad para marcar manualmente una deuda como pagada. Esto complementa el marcado automatico cuando el saldo llega a $0 mediante pagos.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Marcar deuda como pagada (Happy Path)

```gherkin
Given tengo una deuda activa con saldo pendiente
When hago clic en "Marcar como pagada"
And confirmo la accion
Then la deuda debe cambiar a estado "paid"
And debe desaparecer de la lista de deudas activas
And debo ver mensaje de felicitacion
```

### Scenario 2: Auto-marcado al completar pagos (Happy Path)

```gherkin
Given tengo una deuda con saldo pendiente de $100
When registro un pago de $100
Then la deuda debe marcarse automaticamente como pagada
```

### Scenario 3: Confirmacion requerida (UX)

```gherkin
Given veo una deuda activa
When hago clic en "Marcar como pagada"
Then debo ver dialogo de confirmacion
And el dialogo debe mostrar el saldo pendiente actual
When cancelo
Then la deuda debe permanecer activa
```

---

## Technical Notes

### Backend

**API Route:** `POST /api/debts/:id/complete` o `PATCH /api/debts/:id` con `status: 'paid'`

---

## Dependencies

### Blocked By

- FIN-25: Registrar deuda
- FIN-28: Ver lista de deudas

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Marcado manual funcionando
- [ ] Auto-marcado con pagos
- [ ] Confirmacion implementada
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-16-debt-control/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-017)

---

_Document created: 2025-01-25_
