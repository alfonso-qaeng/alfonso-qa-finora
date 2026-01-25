# Filtrar Transacciones

**Jira Key:** FIN-11
**Epic:** FIN-7 (Gestion de Transacciones)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** filtrar mis transacciones por tipo, categoria y rango de fechas
**So that** pueda encontrar transacciones especificas facilmente

---

## Description

Implementar filtros para la lista de transacciones. Los filtros incluyen: tipo (ingreso/gasto/todos), categoria (solo para gastos), y rango de fechas. Los filtros se pueden combinar y se aplican en tiempo real o al hacer clic en "Aplicar".

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Filtrar por tipo de transaccion (Happy Path)

```gherkin
Given estoy en la lista de transacciones
And tengo gastos e ingresos registrados
When selecciono el filtro tipo "Gastos"
Then solo debo ver las transacciones de tipo gasto
And los ingresos no deben mostrarse
```

### Scenario 2: Filtrar por categoria (Happy Path)

```gherkin
Given estoy en la lista de transacciones
And tengo gastos en diferentes categorias
When selecciono la categoria "Alimentacion"
Then solo debo ver los gastos de categoria Alimentacion
And gastos de otras categorias no deben mostrarse
```

### Scenario 3: Filtrar por rango de fechas (Happy Path)

```gherkin
Given estoy en la lista de transacciones
And tengo transacciones de diferentes fechas
When selecciono fecha inicio "2025-01-01"
And selecciono fecha fin "2025-01-15"
And aplico el filtro
Then solo debo ver transacciones dentro de ese rango
And transacciones fuera del rango no deben mostrarse
```

### Scenario 4: Combinar multiples filtros (Happy Path)

```gherkin
Given estoy en la lista de transacciones
When selecciono tipo "Gastos"
And selecciono categoria "Transporte"
And selecciono mes "Enero 2025"
Then solo debo ver gastos de transporte de enero 2025
```

### Scenario 5: Limpiar filtros (Happy Path)

```gherkin
Given tengo filtros aplicados
And la lista muestra resultados filtrados
When hago clic en "Limpiar filtros"
Then todos los filtros deben resetearse
And debo ver todas mis transacciones
```

---

## Technical Notes

### Frontend

- **Componente:** `TransactionFilters.tsx` en `/src/components/transactions/`
- **Estado:** URL params para persistir filtros (shareable URLs)
- **UX:** Filtros colapsables en mobile

**data-testid:**

- `filter-type` - Selector de tipo
- `filter-category` - Selector de categoria
- `filter-date-start` - Fecha inicio
- `filter-date-end` - Fecha fin
- `filter-apply` - Boton aplicar (si no es real-time)
- `filter-clear` - Boton limpiar filtros
- `filter-results-count` - Contador de resultados

### Backend

**API Route:** `GET /api/transactions`

**Query Parameters:**

- `type`: 'income' | 'expense' | undefined (all)
- `category_id`: uuid | undefined
- `date_from`: ISO date string
- `date_to`: ISO date string
- `page`, `limit`: paginacion

**Response:** Same as FIN-10 with filtered data

---

## Dependencies

### Blocked By

- FIN-10: Ver lista de transacciones

### Blocks

- Ninguna

### Related Stories

- FIN-10: Lista base a filtrar

---

## UI/UX Considerations

- Filtros pueden ser real-time o con boton "Aplicar"
- Mostrar numero de resultados filtrados
- Presets rapidos: "Este mes", "Mes pasado", "Ultima semana"
- Categoria solo visible cuando tipo = Gastos
- Filtros persisten en URL para compartir

---

## Definition of Done

- [ ] Filtros de tipo, categoria y fecha implementados
- [ ] Filtros combinables funcionando
- [ ] URL params para persistencia
- [ ] Boton limpiar filtros
- [ ] Tests E2E (5 scenarios)
- [ ] Code review aprobado
- [ ] Deployed to staging

---

## Testing Strategy

**Test Cases Expected:** 6+ test cases

1. TC-001: Filtrar solo gastos
2. TC-002: Filtrar solo ingresos
3. TC-003: Filtrar por categoria
4. TC-004: Filtrar por rango de fechas
5. TC-005: Combinar filtros
6. TC-006: Limpiar filtros

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-7-transaction-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-009)

---

_Document created: 2025-01-25_
