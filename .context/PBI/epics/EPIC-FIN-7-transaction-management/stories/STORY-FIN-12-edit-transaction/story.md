# Editar Transaccion Existente

**Jira Key:** FIN-12
**Epic:** FIN-7 (Gestion de Transacciones)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** editar una transaccion existente
**So that** pueda corregir errores en mis registros

---

## Description

Implementar la funcionalidad para editar transacciones existentes. El usuario puede modificar monto, categoria (gastos), fuente (ingresos), descripcion y fecha. Solo puede editar sus propias transacciones (RLS).

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Editar monto de transaccion (Happy Path)

```gherkin
Given estoy en la lista de transacciones
And tengo un gasto de $100 en "Alimentacion"
When hago clic en editar ese gasto
And cambio el monto a $150
And hago clic en "Guardar cambios"
Then el monto debe actualizarse a $150
And debo ver el mensaje "Transaccion actualizada"
And mi balance debe reflejar el cambio
```

### Scenario 2: Editar categoria de gasto (Happy Path)

```gherkin
Given estoy editando un gasto
And la categoria actual es "Alimentacion"
When cambio la categoria a "Entretenimiento"
And guardo los cambios
Then la categoria debe actualizarse
And el icono y color deben cambiar correspondientemente
```

### Scenario 3: Editar fecha de transaccion (Happy Path)

```gherkin
Given estoy editando una transaccion
And la fecha actual es "2025-01-20"
When cambio la fecha a "2025-01-15"
And guardo los cambios
Then la fecha debe actualizarse
And la transaccion debe reordenarse en la lista
```

### Scenario 4: Intentar editar transaccion de otro usuario (Security)

```gherkin
Given existe una transaccion de otro usuario
When intento acceder a editarla via API
Then debo recibir error 403 Forbidden
And la transaccion no debe modificarse
```

### Scenario 5: Cancelar edicion (Edge Case)

```gherkin
Given estoy editando una transaccion
And he modificado el monto
When hago clic en "Cancelar"
Then los cambios no deben guardarse
And la transaccion debe mantener valores originales
```

---

## Technical Notes

### Frontend

- **Componente:** Reutilizar `ExpenseForm.tsx` / `IncomeForm.tsx` en modo edicion
- **Pagina:** Modal o `/transactions/:id/edit`
- **Estado:** Precargar datos existentes en formulario

**data-testid:**

- `edit-transaction-form` - Formulario de edicion
- `edit-transaction-submit` - Boton guardar
- `edit-transaction-cancel` - Boton cancelar
- `edit-transaction-success` - Mensaje exito

### Backend

**API Route:** `PATCH /api/transactions/:id`

**Request:**

```json
{
  "amount": 150.0,
  "category_id": "uuid",
  "description": "Nueva descripcion",
  "date": "2025-01-15"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "expense",
    "amount": 150.0,
    "category_id": "uuid",
    "description": "Nueva descripcion",
    "date": "2025-01-15",
    "updated_at": "2025-01-25T..."
  }
}
```

**Response Error (403):**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permiso para editar esta transaccion"
  }
}
```

### Security

- RLS: Solo owner puede editar
- Validar que type no cambie (expense no puede volverse income)

---

## Dependencies

### Blocked By

- FIN-10: Ver lista de transacciones
- FIN-8: Registrar gasto (formulario base)
- FIN-9: Registrar ingreso (formulario base)

### Blocks

- Ninguna

---

## UI/UX Considerations

- Formulario prellenado con datos actuales
- Indicar claramente que es modo edicion
- Mostrar cambios antes de guardar (opcional)
- Confirmacion antes de descartar cambios no guardados

---

## Definition of Done

- [ ] Edicion de transacciones implementada
- [ ] Validaciones iguales que creacion
- [ ] RLS verificado
- [ ] Tests E2E (5 scenarios)
- [ ] Code review aprobado
- [ ] Deployed to staging

---

## Testing Strategy

**Test Cases Expected:** 6+ test cases

1. TC-001: Editar monto exitosamente
2. TC-002: Editar categoria exitosamente
3. TC-003: Editar fecha exitosamente
4. TC-004: RLS - no puede editar transaccion ajena
5. TC-005: Cancelar edicion
6. TC-006: Validaciones al editar

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-7-transaction-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-010)

---

_Document created: 2025-01-25_
