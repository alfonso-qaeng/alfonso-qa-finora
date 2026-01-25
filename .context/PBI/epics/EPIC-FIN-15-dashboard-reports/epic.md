# Dashboard y Reportes

**Jira Key:** FIN-15
**Status:** To Do
**Priority:** P0 (CRITICAL)
**Phase:** Foundation (Sprint 2-3)
**Estimated Points:** 18

---

## Epic Description

Proveer una vista consolidada del estado financiero del usuario con metricas clave, graficos y comparativas. Es la pantalla principal que muestra el resumen de todas las otras funcionalidades.

**Business Value:**

El Dashboard es el punto de entrada principal de la aplicacion:

- Vista rapida del balance mensual (ingresos - gastos)
- Gastos agrupados por categoria con graficos
- Resumen de deudas activas con alertas de vencimiento
- Progreso visual de metas de ahorro
- Proximos cargos de suscripciones
- Comparativa mes actual vs anterior para identificar tendencias

---

## User Stories

| #   | Jira Key   | Summary                                 | Points | Priority | FR Ref |
| --- | ---------- | --------------------------------------- | ------ | -------- | ------ |
| 6.1 | **FIN-19** | Ver balance mensual (ingresos - gastos) | 3      | High     | FR-033 |
| 6.2 | **FIN-20** | Ver gastos agrupados por categoria      | 3      | High     | FR-034 |
| 6.3 | **FIN-21** | Ver resumen de deudas activas           | 3      | Medium   | FR-035 |
| 6.4 | **FIN-22** | Ver progreso de metas de ahorro         | 3      | Medium   | FR-036 |
| 6.5 | **FIN-23** | Ver proximos cargos de suscripciones    | 3      | Medium   | FR-037 |
| 6.6 | **FIN-24** | Ver comparativa mes actual vs anterior  | 3      | Medium   | FR-038 |

---

## Scope

### In Scope

- Widget de balance mensual con ingresos, gastos y diferencia
- Grafico de dona/pie para gastos por categoria
- Tarjeta resumen de deudas activas (total, proxima a vencer)
- Mini-cards de progreso de metas de ahorro
- Lista de proximos cargos de suscripciones (7 dias)
- Comparativa numerica y porcentual vs mes anterior

### Out of Scope (Future)

- Graficos de tendencias historicas
- Exportacion de reportes
- Personalizacion de widgets
- Alertas push de vencimientos
- Predicciones de gastos

---

## Acceptance Criteria (Epic Level)

1. Dashboard muestra balance mensual actualizado en tiempo real
2. Gastos por categoria se visualizan en grafico de dona con porcentajes
3. Resumen de deudas muestra total pendiente y deuda mas proxima a vencer
4. Progreso de metas muestra porcentaje y monto faltante
5. Proximos cargos lista suscripciones de los siguientes 7 dias
6. Comparativa muestra variacion porcentual mes actual vs anterior

---

## Related Functional Requirements

- **FR-033:** Monthly Balance View
- **FR-034:** Expenses by Category Chart
- **FR-035:** Active Debts Summary
- **FR-036:** Savings Goals Progress
- **FR-037:** Upcoming Subscription Charges
- **FR-038:** Monthly Comparison

See: `.context/SRS/functional-specs.md`

---

## Technical Considerations

### API Endpoints

| Method | Endpoint                            | Description                       |
| ------ | ----------------------------------- | --------------------------------- |
| GET    | /api/dashboard/balance              | Get monthly balance               |
| GET    | /api/dashboard/expenses-by-category | Get expenses grouped by category  |
| GET    | /api/dashboard/debts-summary        | Get active debts summary          |
| GET    | /api/dashboard/goals-progress       | Get savings goals progress        |
| GET    | /api/dashboard/upcoming-charges     | Get upcoming subscription charges |
| GET    | /api/dashboard/comparison           | Get month comparison data         |

### Frontend Components

- `DashboardPage.tsx` - Main dashboard layout
- `BalanceCard.tsx` - Monthly balance widget
- `ExpensesByCategoryChart.tsx` - Donut chart component
- `DebtsSummaryCard.tsx` - Debts overview widget
- `GoalsProgressCard.tsx` - Savings goals mini-cards
- `UpcomingChargesCard.tsx` - Subscriptions list
- `MonthComparisonCard.tsx` - Comparison widget

### Performance Requirements

- Dashboard load time < 2 seconds
- Use TanStack Query for caching
- Implement skeleton loaders for each widget
- Consider parallel data fetching

---

## Dependencies

### External Dependencies

- Supabase Database
- Chart library (Recharts or Chart.js)

### Internal Dependencies

- EPIC-FIN-1: Authentication (requires logged in user)
- EPIC-FIN-7: Transactions (for balance and category data)
- EPIC-FIN-16: Debt Control (for debts summary)
- EPIC-FIN-17: Savings Goals (for goals progress)
- EPIC-FIN-18: Subscriptions (for upcoming charges)

### Blocks

- None (final integration epic)

---

## Success Metrics

### Functional Metrics

- Dashboard load time < 2 seconds
- All widgets load without errors
- Data is accurate and up-to-date

### Business Metrics

- Dashboard viewed daily by 60%+ users
- Users spend 30+ seconds on dashboard per session

---

## Testing Strategy

### Test Coverage Requirements

- **Unit Tests:** Data aggregation functions, formatters
- **Integration Tests:** API endpoints with mock data
- **E2E Tests:** Full dashboard flow with Playwright

### Critical Test Scenarios

1. Dashboard displays correct balance
2. Category chart shows accurate percentages
3. Debts summary reflects active debts
4. Goals progress matches actual contributions
5. Upcoming charges lists correct dates
6. Month comparison calculates correctly

---

## Implementation Plan

### Recommended Story Order

1. **FIN-19** - Balance mensual (foundation)
2. **FIN-20** - Gastos por categoria (depends on transactions)
3. **FIN-24** - Comparativa mensual (extends balance)
4. **FIN-21** - Resumen de deudas (depends on EPIC 3)
5. **FIN-22** - Progreso de metas (depends on EPIC 4)
6. **FIN-23** - Proximos cargos (depends on EPIC 5)

### Estimated Effort

- **Development:** 1 sprint (2 weeks)
- **Testing:** 0.5 sprint (1 week)
- **Total:** 1.5 sprints

---

## Related Documentation

- **PRD:** `.context/PRD/mvp-scope.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-033 to FR-038)
- **Architecture:** `.context/SRS/architecture-specs.md`
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

_Document created: 2025-01-25_
