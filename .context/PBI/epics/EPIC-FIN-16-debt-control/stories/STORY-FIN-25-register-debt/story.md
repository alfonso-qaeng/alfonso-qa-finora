# Registrar una Deuda

**Jira Key:** FIN-25
**Epic:** FIN-16 (Control de Deudas)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** registrar una deuda con monto total, acreedor, fecha de vencimiento y descripcion
**So that** pueda trackear lo que debo y no olvidar mis compromisos

---

## Description

Implementar formulario para registrar deudas. Campos: monto total (requerido), acreedor/nombre (requerido), fecha de vencimiento (opcional), descripcion (opcional).

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Registrar deuda completa (Happy Path)

```gherkin
Given estoy autenticado
When navego a la seccion de deudas
And hago clic en "Nueva Deuda"
And ingreso monto "$5000"
And ingreso acreedor "Banco XYZ"
And ingreso fecha vencimiento "2025-06-01"
And ingreso descripcion "Prestamo personal"
And hago clic en "Guardar"
Then la deuda debe crearse exitosamente
And el saldo pendiente debe ser igual al monto total ($5000)
And debo ver el mensaje "Deuda registrada exitosamente"
```

### Scenario 2: Registrar deuda con campos minimos (Happy Path)

```gherkin
Given estoy en el formulario de nueva deuda
When ingreso solo monto "$1000" y acreedor "Amigo Juan"
And hago clic en "Guardar"
Then la deuda debe crearse sin fecha de vencimiento
And sin descripcion
```

### Scenario 3: Validacion de monto requerido (Error Case)

```gherkin
Given estoy en el formulario de nueva deuda
When ingreso acreedor pero no monto
And intento guardar
Then debo ver error "El monto es requerido"
```

---

## Technical Notes

### Frontend

**data-testid:**

- `debt-form` - Formulario
- `debt-amount` - Input monto
- `debt-creditor` - Input acreedor
- `debt-due-date` - Input fecha
- `debt-description` - Input descripcion
- `debt-submit` - Boton guardar

### Backend

**API Route:** `POST /api/debts`

**Request:**

```json
{
  "total_amount": 5000.0,
  "creditor": "Banco XYZ",
  "due_date": "2025-06-01",
  "description": "Prestamo personal"
}
```

---

## Dependencies

### Blocked By

- FIN-2, FIN-3: Authentication

### Blocks

- FIN-26 a FIN-31: Otras operaciones de deudas

---

## Definition of Done

- [ ] Formulario de deuda implementado
- [ ] API POST funcionando
- [ ] RLS configurado
- [ ] Tests E2E (3 scenarios)
- [ ] Code review aprobado

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-16-debt-control/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-013)

---

_Document created: 2025-01-25_
