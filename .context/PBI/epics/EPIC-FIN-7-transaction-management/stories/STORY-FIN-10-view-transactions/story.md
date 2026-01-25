# Ver Lista de Transacciones

**Jira Key:** FIN-10
**Epic:** FIN-7 (Gestion de Transacciones)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver la lista de mis transacciones ordenadas por fecha
**So that** pueda revisar mi historial financiero

---

## Description

Implementar la vista de lista de transacciones con paginacion. Muestra gastos e ingresos ordenados por fecha descendente (mas recientes primero). Incluye informacion de categoria (para gastos), monto con color diferenciado, y fecha.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver lista de transacciones (Happy Path)

```gherkin
Given estoy autenticado
And tengo transacciones registradas
When navego a la pagina de transacciones "/transactions"
Then debo ver mis transacciones ordenadas por fecha descendente
And cada transaccion debe mostrar: tipo, monto, categoria/fuente, fecha
And los gastos deben mostrarse en rojo
And los ingresos deben mostrarse en verde
```

### Scenario 2: Paginacion de transacciones (Happy Path)

```gherkin
Given tengo mas de 20 transacciones registradas
When navego a la lista de transacciones
Then debo ver las primeras 20 transacciones
And debo ver un boton "Cargar mas" o paginacion
When hago clic en "Cargar mas"
Then debo ver las siguientes 20 transacciones
```

### Scenario 3: Lista vacia (Edge Case)

```gherkin
Given estoy autenticado
And no tengo ninguna transaccion registrada
When navego a la pagina de transacciones
Then debo ver el mensaje "No tienes transacciones aun"
And debo ver un boton "Registrar tu primera transaccion"
```

### Scenario 4: Mostrar categoria con icono y color (Happy Path)

```gherkin
Given tengo un gasto en categoria "Alimentacion"
When veo la lista de transacciones
Then el gasto debe mostrar el icono "utensils"
And debe mostrar el color amber (#F59E0B)
And debe mostrar el nombre "Alimentacion"
```

---

## Technical Notes

### Frontend

- **Componente:** `TransactionList.tsx` en `/src/components/transactions/`
- **Pagina:** `/transactions` (App Router: `src/app/(app)/transactions/page.tsx`)
- **Estado:** TanStack Query con infinite scroll o paginacion
- **Skeleton:** Loading state mientras carga

**data-testid:**

- `transaction-list` - Contenedor de lista
- `transaction-item` - Cada item de transaccion
- `transaction-amount` - Monto de transaccion
- `transaction-category` - Categoria/fuente
- `transaction-date` - Fecha
- `transaction-empty` - Mensaje de lista vacia
- `transaction-load-more` - Boton cargar mas

### Backend

**API Route:** `GET /api/transactions`

**Query Parameters:**

- `page`: numero de pagina (default 1)
- `limit`: items por pagina (default 20, max 100)

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "expense",
        "amount": 150.5,
        "category": {
          "id": "uuid",
          "name": "Alimentacion",
          "icon": "utensils",
          "color": "#F59E0B"
        },
        "description": "Compras",
        "date": "2025-01-20"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "hasMore": true
    }
  }
}
```

---

## Dependencies

### Blocked By

- FIN-8: Registrar gasto (necesita datos)
- FIN-9: Registrar ingreso (necesita datos)
- FIN-14: Categorias predefinidas (para mostrar iconos)

### Blocks

- FIN-11: Filtrar transacciones
- FIN-12: Editar transaccion
- FIN-13: Eliminar transaccion

---

## UI/UX Considerations

- Lista responsive (cards en mobile, tabla en desktop)
- Infinite scroll o paginacion tradicional
- Skeleton loaders durante carga
- Swipe actions en mobile (editar/eliminar)
- Agrupacion por fecha opcional (Hoy, Ayer, Esta semana)

---

## Definition of Done

- [ ] Lista de transacciones implementada
- [ ] Paginacion funcionando
- [ ] Categorias con iconos y colores
- [ ] Estado vacio con CTA
- [ ] Tests E2E (4 scenarios)
- [ ] Code review aprobado
- [ ] Deployed to staging

---

## Testing Strategy

**Test Cases Expected:** 5+ test cases

1. TC-001: Ver lista ordenada por fecha
2. TC-002: Paginacion funciona correctamente
3. TC-003: Lista vacia muestra mensaje
4. TC-004: Gastos en rojo, ingresos en verde
5. TC-005: Categorias muestran iconos correctos

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-7-transaction-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-008)

---

_Document created: 2025-01-25_
