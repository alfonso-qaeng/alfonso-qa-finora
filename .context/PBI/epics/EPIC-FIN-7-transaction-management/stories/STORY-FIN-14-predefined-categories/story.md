# Categorias Predefinidas para Gastos

**Jira Key:** FIN-14
**Epic:** FIN-7 (Gestion de Transacciones)
**Priority:** High
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** seleccionar de una lista de categorias predefinidas al registrar un gasto
**So that** pueda categorizar mis gastos de forma consistente

---

## Description

Implementar las 10 categorias predefinidas para gastos. Las categorias son globales (no por usuario) y cada una tiene nombre, icono (Lucide) y color. Se muestran en el selector de categoria al crear/editar gastos.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver categorias disponibles (Happy Path)

```gherkin
Given estoy registrando un nuevo gasto
When abro el selector de categoria
Then debo ver las 10 categorias predefinidas:
  | Nombre          | Icono           |
  | Alimentacion    | utensils        |
  | Transporte      | car             |
  | Entretenimiento | film            |
  | Salud           | heart           |
  | Educacion       | book            |
  | Hogar           | home            |
  | Ropa            | shirt           |
  | Tecnologia      | laptop          |
  | Servicios       | zap             |
  | Otros           | more-horizontal |
And cada categoria debe mostrar su icono y color
```

### Scenario 2: Seleccionar categoria (Happy Path)

```gherkin
Given veo la lista de categorias
When selecciono "Transporte"
Then la categoria debe quedar seleccionada
And el selector debe mostrar el icono de auto
And el selector debe mostrar el color azul
```

### Scenario 3: Categoria requerida para gastos (Validation)

```gherkin
Given estoy registrando un gasto
And no he seleccionado categoria
When intento guardar el gasto
Then debo ver el error "La categoria es requerida"
And el gasto no debe guardarse
```

### Scenario 4: Categoria no aplica a ingresos (Edge Case)

```gherkin
Given estoy registrando un ingreso
When veo el formulario
Then no debo ver el selector de categoria
And el ingreso puede guardarse sin categoria
```

---

## Technical Notes

### Frontend

- **Componente:** `CategorySelector.tsx` en `/src/components/transactions/`
- **Iconos:** Usar Lucide React icons
- **Estado:** Fetch de categorias con TanStack Query (cacheable)

**data-testid:**

- `category-selector` - Selector de categoria
- `category-option-{id}` - Cada opcion de categoria
- `category-selected` - Categoria seleccionada

### Backend

**Seed Data:** Las categorias se crean via migration/seed

```sql
INSERT INTO categories (id, name, icon, color) VALUES
  (gen_random_uuid(), 'Alimentacion', 'utensils', '#F59E0B'),
  (gen_random_uuid(), 'Transporte', 'car', '#3B82F6'),
  (gen_random_uuid(), 'Entretenimiento', 'film', '#8B5CF6'),
  (gen_random_uuid(), 'Salud', 'heart', '#EF4444'),
  (gen_random_uuid(), 'Educacion', 'book', '#10B981'),
  (gen_random_uuid(), 'Hogar', 'home', '#6366F1'),
  (gen_random_uuid(), 'Ropa', 'shirt', '#EC4899'),
  (gen_random_uuid(), 'Tecnologia', 'laptop', '#6B7280'),
  (gen_random_uuid(), 'Servicios', 'zap', '#F97316'),
  (gen_random_uuid(), 'Otros', 'more-horizontal', '#9CA3AF');
```

**API Route:** `GET /api/categories`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Alimentacion",
      "icon": "utensils",
      "color": "#F59E0B"
    }
  ]
}
```

### Database

**Tabla: categories**

- `id` (uuid, PK)
- `name` (varchar 50, unique)
- `icon` (varchar 50)
- `color` (varchar 7, hex color)

---

## Dependencies

### Blocked By

- Database schema creado

### Blocks

- FIN-8: Registrar gasto (usa categorias)
- FIN-12: Editar transaccion (usa categorias)
- FIN-20: Gastos por categoria en dashboard

---

## UI/UX Considerations

- Selector visual con iconos y colores
- Dropdown o grid de opciones
- Hover state muestra nombre completo
- Mobile-friendly touch targets
- "Otros" como ultima opcion catch-all

### Category Colors

| Category        | Color   | Tailwind Class |
| --------------- | ------- | -------------- |
| Alimentacion    | #F59E0B | amber-500      |
| Transporte      | #3B82F6 | blue-500       |
| Entretenimiento | #8B5CF6 | violet-500     |
| Salud           | #EF4444 | red-500        |
| Educacion       | #10B981 | emerald-500    |
| Hogar           | #6366F1 | indigo-500     |
| Ropa            | #EC4899 | pink-500       |
| Tecnologia      | #6B7280 | gray-500       |
| Servicios       | #F97316 | orange-500     |
| Otros           | #9CA3AF | gray-400       |

---

## Definition of Done

- [ ] Tabla categories con seed data
- [ ] API GET /api/categories
- [ ] CategorySelector component
- [ ] Iconos y colores funcionando
- [ ] Tests E2E (4 scenarios)
- [ ] Code review aprobado
- [ ] Deployed to staging

---

## Testing Strategy

**Test Cases Expected:** 5+ test cases

1. TC-001: Ver todas las categorias
2. TC-002: Seleccionar categoria
3. TC-003: Categoria requerida para gastos
4. TC-004: Ingresos sin categoria
5. TC-005: Iconos y colores correctos

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-7-transaction-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-012)

---

_Document created: 2025-01-25_
