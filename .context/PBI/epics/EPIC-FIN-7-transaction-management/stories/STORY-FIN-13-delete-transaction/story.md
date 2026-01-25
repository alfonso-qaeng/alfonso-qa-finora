# Eliminar Transaccion

**Jira Key:** FIN-13
**Epic:** FIN-7 (Gestion de Transacciones)
**Priority:** Medium
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** eliminar una transaccion
**So that** pueda remover registros incorrectos o duplicados

---

## Description

Implementar la funcionalidad para eliminar transacciones. Requiere confirmacion antes de eliminar. Es un hard delete (no soft delete). Solo puede eliminar sus propias transacciones (RLS).

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Eliminar transaccion con confirmacion (Happy Path)

```gherkin
Given estoy en la lista de transacciones
And tengo un gasto que quiero eliminar
When hago clic en el boton eliminar de esa transaccion
Then debo ver un dialogo de confirmacion
And el dialogo debe mostrar "¿Estas seguro de eliminar esta transaccion?"
When confirmo la eliminacion
Then la transaccion debe eliminarse permanentemente
And debo ver el mensaje "Transaccion eliminada"
And mi balance debe actualizarse
```

### Scenario 2: Cancelar eliminacion (Happy Path)

```gherkin
Given veo el dialogo de confirmacion de eliminacion
When hago clic en "Cancelar"
Then el dialogo debe cerrarse
And la transaccion debe permanecer en la lista
```

### Scenario 3: Intentar eliminar transaccion de otro usuario (Security)

```gherkin
Given existe una transaccion de otro usuario
When intento eliminarla via API
Then debo recibir error 403 Forbidden
And la transaccion no debe eliminarse
```

### Scenario 4: Eliminar desde detalle de transaccion (Happy Path)

```gherkin
Given estoy viendo el detalle de una transaccion
When hago clic en "Eliminar"
And confirmo la eliminacion
Then debo ser redirigido a la lista de transacciones
And la transaccion ya no debe aparecer
```

---

## Technical Notes

### Frontend

- **Componente:** `DeleteTransactionDialog.tsx` en `/src/components/transactions/`
- **Estado:** TanStack Query mutation con invalidacion de cache

**data-testid:**

- `delete-transaction-button` - Boton eliminar (en lista o detalle)
- `delete-confirm-dialog` - Dialogo de confirmacion
- `delete-confirm-button` - Boton confirmar eliminacion
- `delete-cancel-button` - Boton cancelar
- `delete-success` - Mensaje de exito

### Backend

**API Route:** `DELETE /api/transactions/:id`

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "message": "Transaccion eliminada exitosamente"
  }
}
```

**Response Error (403):**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permiso para eliminar esta transaccion"
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Transaccion no encontrada"
  }
}
```

### Security

- RLS: Solo owner puede eliminar
- Hard delete (no recovery)

---

## Dependencies

### Blocked By

- FIN-10: Ver lista de transacciones

### Blocks

- Ninguna

---

## UI/UX Considerations

- Dialogo de confirmacion obligatorio
- Mostrar detalles de transaccion en dialogo
- Boton de eliminar en rojo/destructivo
- Toast de confirmacion despues de eliminar
- Undo no disponible (hard delete)

---

## Definition of Done

- [ ] Eliminacion con confirmacion implementada
- [ ] RLS verificado
- [ ] Balance se actualiza correctamente
- [ ] Tests E2E (4 scenarios)
- [ ] Code review aprobado
- [ ] Deployed to staging

---

## Testing Strategy

**Test Cases Expected:** 5+ test cases

1. TC-001: Eliminar transaccion exitosamente
2. TC-002: Cancelar eliminacion
3. TC-003: RLS - no puede eliminar transaccion ajena
4. TC-004: Eliminar desde detalle
5. TC-005: Balance se actualiza al eliminar

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-7-transaction-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-011)

---

_Document created: 2025-01-25_
