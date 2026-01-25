# Crear Meta de Ahorro

**Jira Key:** FIN-32
**Epic:** FIN-17 (Metas de Ahorro)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** crear una meta de ahorro con nombre, monto objetivo y fecha limite
**So that** pueda definir mis objetivos de ahorro

---

## Description

Implementar formulario para crear metas de ahorro. Campos: nombre (requerido), monto objetivo (requerido), fecha limite (opcional). El progreso inicial es $0.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Crear meta con todos los campos (Happy Path)

```gherkin
Given estoy autenticado
When navego a metas de ahorro
And hago clic en "Nueva Meta"
And ingreso nombre "Vacaciones Cancun"
And ingreso monto objetivo "$10,000"
And ingreso fecha limite "2025-12-01"
And hago clic en "Crear"
Then la meta debe crearse con progreso 0%
And debo ver el mensaje "Meta creada exitosamente"
```

### Scenario 2: Crear meta sin fecha limite (Happy Path)

```gherkin
Given estoy creando una meta
When ingreso nombre y monto pero no fecha
And guardo
Then la meta debe crearse sin fecha limite
And debe mostrarse "Sin fecha limite"
```

### Scenario 3: Nombre requerido (Error Case)

```gherkin
Given estoy creando una meta
When ingreso monto pero no nombre
And intento guardar
Then debo ver error "El nombre es requerido"
```

---

## Technical Notes

### Backend

**API Route:** `POST /api/goals`

**Request:**

```json
{
  "name": "Vacaciones Cancun",
  "target_amount": 10000.0,
  "target_date": "2025-12-01"
}
```

---

## Dependencies

### Blocked By

- FIN-2, FIN-3: Authentication

### Blocks

- FIN-33 a FIN-38: Otras operaciones de metas

---

## Definition of Done

- [ ] Formulario implementado
- [ ] API POST funcionando
- [ ] Progreso inicial 0%
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-17-savings-goals/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-020)

---

_Document created: 2025-01-25_
