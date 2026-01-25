# Registrar un Ingreso

**Jira Key:** FIN-9
**Epic:** FIN-7 (Gestion de Transacciones)
**Priority:** High
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** registrar un ingreso con monto, fuente opcional y fecha
**So that** pueda trackear mis ingresos y ver mi balance real

---

## Description

Implementar el formulario para registrar ingresos. A diferencia de los gastos, los ingresos no requieren categoria, pero pueden tener una fuente opcional (ej: "Salario", "Freelance", "Venta"). La fecha es opcional y default a hoy.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Registrar ingreso completo (Happy Path)

```gherkin
Given estoy autenticado en mi cuenta
And navego a la pagina de transacciones
When hago clic en "Nuevo Ingreso"
And ingreso el monto "5000.00"
And ingreso la fuente "Salario mensual"
And ingreso la descripcion "Pago enero 2025"
And selecciono la fecha "2025-01-15"
And hago clic en "Guardar"
Then el ingreso debe ser creado exitosamente
And debo ver el mensaje "Ingreso registrado exitosamente"
And el ingreso debe aparecer en mi lista de transacciones
And mi balance debe actualizarse sumando 5000.00
```

### Scenario 2: Registrar ingreso con campos minimos (Happy Path)

```gherkin
Given estoy en el formulario de nuevo ingreso
When ingreso solo el monto "1500.00"
And hago clic en "Guardar"
Then el ingreso debe ser creado con fecha de hoy
And la fuente y descripcion deben quedar vacias
And el ingreso debe aparecer en mi lista
```

### Scenario 3: Fuente opcional con caracteres especiales (Edge Case)

```gherkin
Given estoy en el formulario de nuevo ingreso
And ingreso el monto "200"
When ingreso la fuente "Pago cliente - Proyecto #123"
And hago clic en "Guardar"
Then el ingreso debe guardarse correctamente
And la fuente debe mostrarse tal como la ingrese
```

### Scenario 4: Validacion de monto cero (Error Case)

```gherkin
Given estoy en el formulario de nuevo ingreso
When ingreso el monto "0"
Then debo ver el error "El monto debe ser mayor a 0"
And el boton guardar debe estar deshabilitado
```

---

## Technical Notes

### Frontend

- **Componente:** `IncomeForm.tsx` en `/src/components/transactions/`
- **Pagina:** `/transactions/new` o modal en `/transactions`
- **Estado:** React Hook Form con validacion Zod
- **Fetch:** TanStack Query mutation

**data-testid:**

- `income-form` - Formulario de ingreso
- `income-amount` - Input de monto
- `income-source` - Input de fuente
- `income-description` - Input de descripcion
- `income-date` - Selector de fecha
- `income-submit` - Boton guardar
- `income-success` - Mensaje de exito

### Backend

**API Route:** `POST /api/transactions`

**Request:**

```json
{
  "type": "income",
  "amount": 5000.0,
  "source": "Salario mensual",
  "description": "Pago enero 2025",
  "date": "2025-01-15"
}
```

**Response Success (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "income",
    "amount": 5000.0,
    "source": "Salario mensual",
    "description": "Pago enero 2025",
    "date": "2025-01-15",
    "created_at": "2025-01-15T..."
  }
}
```

### Validation Rules

- `amount`: required, number > 0, max 999999999.99
- `source`: optional, max 100 chars
- `description`: optional, max 255 chars
- `date`: optional (default today), cannot be future

---

## Dependencies

### Blocked By

- FIN-2: User Registration (necesita usuario)
- FIN-3: User Login (necesita sesion)

### Blocks

- FIN-10: Ver lista de transacciones
- FIN-19: Balance mensual en dashboard

### Related Stories

- FIN-8: Registrar gasto (similar flow)

---

## UI/UX Considerations

- Formulario similar a gastos pero sin categoria
- Campo "Fuente" es texto libre
- Sugerencias de fuentes comunes (autocomplete opcional)
- Color diferente para ingresos (verde) vs gastos (rojo)

---

## Definition of Done

- [ ] Formulario de ingreso implementado
- [ ] Validaciones front y backend
- [ ] API route soporta type: "income"
- [ ] Tests unitarios y E2E (4 scenarios)
- [ ] Code review aprobado
- [ ] Deployed to staging
- [ ] QA testing passed

---

## Testing Strategy

**Test Cases Expected:** 5+ test cases

1. TC-001: Registrar ingreso con todos los campos
2. TC-002: Registrar ingreso con campos minimos
3. TC-003: Fuente con caracteres especiales
4. TC-004: Validacion de monto cero
5. TC-005: Validacion de monto negativo

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-7-transaction-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-007)

---

_Document created: 2025-01-25_
