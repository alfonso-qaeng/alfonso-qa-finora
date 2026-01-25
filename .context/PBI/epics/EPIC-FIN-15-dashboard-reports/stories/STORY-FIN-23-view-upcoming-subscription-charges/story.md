# Ver Proximos Cargos de Suscripciones

**Jira Key:** FIN-23
**Epic:** FIN-15 (Dashboard y Reportes)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver los proximos cargos de suscripciones
**So that** pueda anticipar mis gastos recurrentes

---

## Description

Implementar widget que muestra lista de suscripciones con cargos en los proximos 7 dias. Incluye nombre, monto y fecha de cargo. Ayuda al usuario a anticipar gastos.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Ver proximos cargos (Happy Path)

```gherkin
Given estoy autenticado
And tengo suscripciones con cargos en los proximos 7 dias
When navego al dashboard
Then debo ver lista de proximos cargos
And cada item debe mostrar nombre, monto y fecha
```

### Scenario 2: Ordenados por fecha (Happy Path)

```gherkin
Given tengo las siguientes suscripciones proximas:
  | Nombre   | Fecha      |
  | Netflix  | 2025-01-28 |
  | Spotify  | 2025-01-26 |
When veo los proximos cargos
Then Spotify debe aparecer primero
And Netflix debe aparecer segundo
```

### Scenario 3: Sin cargos proximos (Edge Case)

```gherkin
Given no tengo suscripciones con cargos en los proximos 7 dias
When veo el dashboard
Then debo ver "No hay cargos proximos"
```

---

## Technical Notes

### Frontend

- **Componente:** `UpcomingChargesCard.tsx` en `/src/components/dashboard/`

**data-testid:**

- `upcoming-charges-card` - Widget
- `upcoming-charge-item` - Cada cargo
- `upcoming-empty` - Estado vacio

### Backend

**API Route:** `GET /api/dashboard/upcoming-charges`

**Query Parameters:**

- `days`: numero de dias a futuro (default 7)

**Response:**

```json
{
  "success": true,
  "data": {
    "charges": [
      {
        "subscription_id": "uuid",
        "name": "Spotify",
        "amount": 9.99,
        "next_charge_date": "2025-01-26"
      }
    ]
  }
}
```

---

## Dependencies

### Blocked By

- EPIC-FIN-18: Subscription Management (FIN-39 a FIN-44)

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Widget de proximos cargos implementado
- [ ] Ordenado por fecha
- [ ] Estado vacio
- [ ] Tests E2E (3 scenarios)
- [ ] Code review aprobado

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-15-dashboard-reports/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-037)

---

_Document created: 2025-01-25_
