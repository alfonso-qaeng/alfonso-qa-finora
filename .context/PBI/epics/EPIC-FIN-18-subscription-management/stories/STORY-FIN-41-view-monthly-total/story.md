# Ver Total Mensual de Suscripciones

**Jira Key:** FIN-41
**Epic:** FIN-18 (Gestion de Suscripciones)
**Priority:** Medium
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** ver el total mensual de suscripciones
**So that** pueda entender cuanto gasto en servicios recurrentes

---

## Description

Implementar calculo y visualizacion del total mensual de suscripciones. Convierte semanales (\*4) y anuales (/12) a equivalente mensual.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Calcular total correcto (Happy Path)

```gherkin
Given tengo las siguientes suscripciones:
  | Nombre  | Monto | Frecuencia |
  | Netflix | $200  | mensual    |
  | Spotify | $100  | mensual    |
  | iCloud  | $1200 | anual      |
When veo el total mensual
Then debe mostrar "$400/mes"
| Netflix: $200 + Spotify: $100 + iCloud: $100 (1200/12) |
```

### Scenario 2: Solo activas (Happy Path)

```gherkin
Given tengo suscripciones activas y canceladas
When veo el total
Then solo debe incluir suscripciones activas
```

### Scenario 3: Sin suscripciones (Edge Case)

```gherkin
Given no tengo suscripciones activas
When veo el total
Then debe mostrar "$0/mes"
```

---

## Technical Notes

### Backend

**API Route:** `GET /api/subscriptions/summary`

**Response:**

```json
{
  "success": true,
  "data": {
    "monthly_total": 400.0,
    "breakdown": {
      "weekly": 0,
      "monthly": 300.0,
      "yearly_monthly_equivalent": 100.0
    }
  }
}
```

---

## Dependencies

### Blocked By

- FIN-39: Registrar suscripcion

### Blocks

- Ninguna

---

## Definition of Done

- [ ] Calculo de equivalentes mensual
- [ ] Widget de total
- [ ] Tests E2E (3 scenarios)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-18-subscription-management/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-029)

---

_Document created: 2025-01-25_
