# Registrar un Gasto

**Jira Key:** FIN-8
**Epic:** FIN-7 (Gestion de Transacciones)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** registrar un gasto con monto, categoria, descripcion y fecha
**So that** pueda trackear mis gastos y mantener control de mis finanzas

---

## Description

Implementar el formulario para registrar gastos rapidamente. El objetivo es que un usuario pueda registrar un gasto en menos de 10 segundos. Incluye seleccion de categoria predefinida obligatoria, monto requerido, y descripcion/fecha opcionales (fecha default: hoy).

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Registrar gasto con todos los campos (Happy Path)

```gherkin
Given estoy autenticado en mi cuenta
And navego a la pagina de transacciones
When hago clic en "Nuevo Gasto"
And ingreso el monto "150.50"
And selecciono la categoria "Alimentacion"
And ingreso la descripcion "Compras del super"
And selecciono la fecha "2025-01-20"
And hago clic en "Guardar"
Then el gasto debe ser creado exitosamente
And debo ver el mensaje "Gasto registrado exitosamente"
And el gasto debe aparecer en mi lista de transacciones
And mi balance debe actualizarse restando 150.50
```

### Scenario 2: Registrar gasto con campos minimos (Happy Path)

```gherkin
Given estoy en el formulario de nuevo gasto
When ingreso solo el monto "50.00"
And selecciono la categoria "Otros"
And hago clic en "Guardar"
Then el gasto debe ser creado con fecha de hoy
And la descripcion debe quedar vacia
And el gasto debe aparecer en mi lista
```

### Scenario 3: Validacion de monto invalido (Error Case)

```gherkin
Given estoy en el formulario de nuevo gasto
When ingreso un monto negativo "-50"
Then debo ver el error "El monto debe ser mayor a 0"
And el boton guardar debe estar deshabilitado
```

### Scenario 4: Validacion de monto excesivo (Error Case)

```gherkin
Given estoy en el formulario de nuevo gasto
When ingreso un monto mayor a 999,999,999.99
Then debo ver el error "El monto excede el limite permitido"
And el boton guardar debe estar deshabilitado
```

### Scenario 5: Categoria requerida (Error Case)

```gherkin
Given estoy en el formulario de nuevo gasto
And he ingresado un monto valido
When intento guardar sin seleccionar categoria
Then debo ver el error "La categoria es requerida"
And el gasto no debe guardarse
```

---

## Technical Notes

### Frontend

- **Componente:** `ExpenseForm.tsx` en `/src/components/transactions/`
- **Pagina:** `/transactions/new` o modal en `/transactions`
- **Estado:** React Hook Form con validacion Zod
- **Fetch:** TanStack Query mutation

**data-testid:**

- `expense-form` - Formulario de gasto
- `expense-amount` - Input de monto
- `expense-category` - Selector de categoria
- `expense-description` - Input de descripcion
- `expense-date` - Selector de fecha
- `expense-submit` - Boton guardar
- `expense-success` - Mensaje de exito
- `expense-error` - Mensaje de error

### Backend

**API Route:** `POST /api/transactions`

**Request:**

```json
{
  "type": "expense",
  "amount": 150.5,
  "category_id": "uuid-categoria",
  "description": "Compras del super",
  "date": "2025-01-20"
}
```

**Response Success (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "expense",
    "amount": 150.5,
    "category_id": "uuid",
    "category_name": "Alimentacion",
    "description": "Compras del super",
    "date": "2025-01-20",
    "created_at": "2025-01-20T..."
  }
}
```

### Validation Rules

- `amount`: required, number > 0, max 999999999.99
- `category_id`: required for expenses
- `description`: optional, max 255 chars
- `date`: optional (default today), cannot be future

---

## Dependencies

### Blocked By

- FIN-14: Categorias predefinidas (necesita categorias)
- FIN-2: User Registration (necesita usuario)
- FIN-3: User Login (necesita sesion)

### Blocks

- FIN-10: Ver lista de transacciones
- FIN-19: Balance mensual en dashboard

### Related Stories

- FIN-9: Registrar ingreso (similar flow)

---

## UI/UX Considerations

- Formulario rapido y minimalista
- Monto con teclado numerico en mobile
- Categorias con iconos visuales
- Fecha con datepicker
- Feedback inmediato de validacion
- Auto-focus en campo de monto

---

## Definition of Done

- [ ] Formulario de gasto implementado
- [ ] Validaciones front y backend
- [ ] API route POST /api/transactions
- [ ] RLS policies para transacciones
- [ ] Tests unitarios y E2E (5 scenarios)
- [ ] Code review aprobado
- [ ] Deployed to staging
- [ ] QA testing passed

---

## Testing Strategy

**Test Cases Expected:** 6+ test cases

1. TC-001: Registrar gasto con todos los campos
2. TC-002: Registrar gasto con campos minimos
3. TC-003: Validacion de monto negativo
4. TC-004: Validacion de monto excesivo
5. TC-005: Categoria requerida
6. TC-006: Fecha futura no permitida

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-7-transaction-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-006)

---

_Document created: 2025-01-25_
