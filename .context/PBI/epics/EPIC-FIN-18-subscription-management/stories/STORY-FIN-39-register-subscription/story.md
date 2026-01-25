# Registrar Suscripcion

**Jira Key:** FIN-39
**Epic:** FIN-18 (Gestion de Suscripciones)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** registrar una suscripcion con nombre, monto, frecuencia y fecha de proximo cargo
**So that** pueda trackear mis pagos recurrentes

---

## Description

Implementar formulario para registrar suscripciones. Campos: nombre (requerido), monto (requerido), frecuencia (weekly/monthly/yearly), fecha de proximo cargo (requerido).

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Registrar suscripcion mensual (Happy Path)

```gherkin
Given estoy autenticado
When navego a suscripciones
And hago clic en "Nueva Suscripcion"
And ingreso nombre "Netflix"
And ingreso monto "$199"
And selecciono frecuencia "Mensual"
And ingreso fecha proximo cargo "2025-02-01"
And guardo
Then la suscripcion debe crearse
And debo ver el mensaje "Suscripcion registrada"
```

### Scenario 2: Registrar suscripcion anual (Happy Path)

```gherkin
Given estoy registrando suscripcion
When selecciono frecuencia "Anual"
And ingreso monto "$1200"
Then debe calcularse equivalente mensual ($100)
```

### Scenario 3: Campos requeridos (Error Case)

```gherkin
Given estoy registrando suscripcion
When dejo nombre o monto vacio
Then debo ver errores de validacion
```

---

## Technical Notes

### Backend

**API Route:** `POST /api/subscriptions`

**Request:**

```json
{
  "name": "Netflix",
  "amount": 199.0,
  "frequency": "monthly",
  "next_charge_date": "2025-02-01"
}
```

---

## Dependencies

### Blocked By

- FIN-2, FIN-3: Authentication

### Blocks

- FIN-40 a FIN-44: Otras operaciones

---

## Definition of Done

- [ ] Formulario implementado
- [ ] Calculo de equivalente mensual
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-18-subscription-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-027)

---

_Document created: 2025-01-25_
