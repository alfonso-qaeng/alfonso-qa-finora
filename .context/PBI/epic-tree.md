# Product Backlog - Epic Tree

## Overview

| Metric                     | Value                                            |
| -------------------------- | ------------------------------------------------ |
| **Total Epics**            | 6                                                |
| **Total User Stories**     | 38                                               |
| **Project Code**           | FIN                                              |
| **Jira Project**           | https://alfonso-qaeng.atlassian.net/projects/FIN |
| **Estimated Story Points** | ~99                                              |
| **Estimated Duration**     | 5-6 Sprints (10-12 weeks)                        |

---

## Epic Hierarchy

### EPIC 1: Autenticacion y Gestion de Usuario

**Jira Key:** FIN-1 :white_check_mark:
**Priority:** P0 (CRITICAL)
**Phase:** Foundation (Sprint 1)
**Estimated Points:** 11
**Related FRs:** FR-001 to FR-005
**Local Folder:** `epics/EPIC-FIN-1-user-authentication/`

**Description:**
Permitir a los usuarios registrarse, iniciar sesion y gestionar su cuenta de forma segura. Esta epica es fundamental ya que todas las demas funcionalidades dependen de tener un sistema de autenticacion funcional.

**User Stories (5):**

| #   | ID        | User Story                                 | Points | Local Folder                     |
| --- | --------- | ------------------------------------------ | ------ | -------------------------------- |
| 1.1 | **FIN-2** | Registro de usuario con email y contrasena | 3      | `STORY-FIN-2-user-signup-email/` |
| 1.2 | **FIN-3** | Inicio de sesion con credenciales          | 2      | `STORY-FIN-3-user-login/`        |
| 1.3 | **FIN-4** | Cierre de sesion                           | 1      | `STORY-FIN-4-user-logout/`       |
| 1.4 | **FIN-5** | Recuperacion de contrasena                 | 3      | `STORY-FIN-5-password-recovery/` |
| 1.5 | **FIN-6** | Edicion de perfil de usuario               | 2      | `STORY-FIN-6-edit-profile/`      |

---

### EPIC 2: Gestion de Transacciones (Gastos e Ingresos)

**Jira Key:** FIN-7 :white_check_mark:
**Priority:** P0 (CRITICAL)
**Phase:** Foundation (Sprint 1-2)
**Estimated Points:** 18
**Related FRs:** FR-006 to FR-012
**Local Folder:** `epics/EPIC-FIN-7-transaction-management/`

**Description:**
Permitir a los usuarios registrar, categorizar y visualizar sus transacciones financieras. Esta es la funcionalidad core de la aplicacion, permitiendo trackear gastos e ingresos con categorias predefinidas.

**User Stories (7):**

| #   | ID         | User Story                          | Points | Local Folder                          |
| --- | ---------- | ----------------------------------- | ------ | ------------------------------------- |
| 2.1 | **FIN-8**  | Registrar un gasto                  | 3      | `STORY-FIN-8-register-expense/`       |
| 2.2 | **FIN-9**  | Registrar un ingreso                | 2      | `STORY-FIN-9-register-income/`        |
| 2.3 | **FIN-10** | Ver lista de transacciones          | 3      | `STORY-FIN-10-view-transactions/`     |
| 2.4 | **FIN-11** | Filtrar transacciones               | 3      | `STORY-FIN-11-filter-transactions/`   |
| 2.5 | **FIN-12** | Editar transaccion existente        | 3      | `STORY-FIN-12-edit-transaction/`      |
| 2.6 | **FIN-13** | Eliminar transaccion                | 2      | `STORY-FIN-13-delete-transaction/`    |
| 2.7 | **FIN-14** | Categorias predefinidas para gastos | 2      | `STORY-FIN-14-predefined-categories/` |

---

### EPIC 3: Control de Deudas

**Jira Key:** FIN-16 :white_check_mark:
**Priority:** P1 (HIGH)
**Phase:** Core Features (Sprint 3-4)
**Estimated Points:** 18
**Related FRs:** FR-013 to FR-019
**Local Folder:** `epics/EPIC-FIN-16-debt-control/`

**Description:**
Permitir a los usuarios registrar deudas, trackear pagos parciales y visualizar el progreso de pago. Incluye historial de pagos y marcado de deudas como completadas.

**User Stories (7):**

| #   | ID         | User Story                  | Points | Local Folder                             |
| --- | ---------- | --------------------------- | ------ | ---------------------------------------- |
| 3.1 | **FIN-25** | Registrar una deuda         | 3      | `STORY-FIN-25-register-debt/`            |
| 3.2 | **FIN-26** | Registrar un pago parcial   | 3      | `STORY-FIN-26-register-partial-payment/` |
| 3.3 | **FIN-27** | Ver historial de pagos      | 2      | `STORY-FIN-27-view-payment-history/`     |
| 3.4 | **FIN-28** | Ver lista de deudas activas | 3      | `STORY-FIN-28-view-debt-list/`           |
| 3.5 | **FIN-29** | Marcar deuda como pagada    | 2      | `STORY-FIN-29-mark-debt-paid/`           |
| 3.6 | **FIN-30** | Editar datos de una deuda   | 3      | `STORY-FIN-30-edit-debt/`                |
| 3.7 | **FIN-31** | Eliminar una deuda          | 2      | `STORY-FIN-31-delete-debt/`              |

---

### EPIC 4: Metas de Ahorro

**Jira Key:** FIN-17 :white_check_mark:
**Priority:** P1 (HIGH)
**Phase:** Core Features (Sprint 4-5)
**Estimated Points:** 19
**Related FRs:** FR-020 to FR-026
**Local Folder:** `epics/EPIC-FIN-17-savings-goals/`

**Description:**
Permitir a los usuarios crear metas de ahorro, registrar aportaciones y visualizar progreso con indicadores visuales (barras de progreso, porcentajes). Incluye gamificacion para motivar al usuario.

**User Stories (7):**

| #   | ID         | User Story                  | Points | Local Folder                          |
| --- | ---------- | --------------------------- | ------ | ------------------------------------- |
| 4.1 | **FIN-32** | Crear una meta de ahorro    | 3      | `STORY-FIN-32-create-savings-goal/`   |
| 4.2 | **FIN-33** | Registrar una aportacion    | 3      | `STORY-FIN-33-register-contribution/` |
| 4.3 | **FIN-34** | Ver progreso visual de meta | 3      | `STORY-FIN-34-view-visual-progress/`  |
| 4.4 | **FIN-35** | Ver lista de metas          | 3      | `STORY-FIN-35-view-goals-list/`       |
| 4.5 | **FIN-36** | Editar una meta             | 3      | `STORY-FIN-36-edit-goal/`             |
| 4.6 | **FIN-37** | Eliminar una meta           | 2      | `STORY-FIN-37-delete-goal/`           |
| 4.7 | **FIN-38** | Marcar meta como completada | 2      | `STORY-FIN-38-mark-goal-completed/`   |

---

### EPIC 5: Gestion de Suscripciones

**Jira Key:** FIN-18 :white_check_mark:
**Priority:** P1 (HIGH)
**Phase:** Core Features (Sprint 5)
**Estimated Points:** 15
**Related FRs:** FR-027 to FR-032
**Local Folder:** `epics/EPIC-FIN-18-subscription-management/`

**Description:**
Permitir a los usuarios registrar suscripciones recurrentes, ver proximos cargos y detectar gastos innecesarios. Calcula automaticamente el equivalente mensual para suscripciones anuales.

**User Stories (6):**

| #   | ID         | User Story                 | Points | Local Folder                            |
| --- | ---------- | -------------------------- | ------ | --------------------------------------- |
| 5.1 | **FIN-39** | Registrar una suscripcion  | 3      | `STORY-FIN-39-register-subscription/`   |
| 5.2 | **FIN-40** | Ver lista de suscripciones | 3      | `STORY-FIN-40-view-subscriptions-list/` |
| 5.3 | **FIN-41** | Ver total mensual          | 2      | `STORY-FIN-41-view-monthly-total/`      |
| 5.4 | **FIN-42** | Marcar como cancelada      | 2      | `STORY-FIN-42-cancel-subscription/`     |
| 5.5 | **FIN-43** | Editar suscripcion         | 3      | `STORY-FIN-43-edit-subscription/`       |
| 5.6 | **FIN-44** | Eliminar suscripcion       | 2      | `STORY-FIN-44-delete-subscription/`     |

---

### EPIC 6: Dashboard y Reportes

**Jira Key:** FIN-15 :white_check_mark:
**Priority:** P0 (CRITICAL)
**Phase:** Foundation (Sprint 2-3)
**Estimated Points:** 18
**Related FRs:** FR-033 to FR-038
**Local Folder:** `epics/EPIC-FIN-15-dashboard-reports/`

**Description:**
Proveer una vista consolidada del estado financiero del usuario con metricas clave, graficos y comparativas. Es la pantalla principal que muestra el resumen de todas las otras funcionalidades.

**User Stories (6):**

| #   | ID         | User Story                             | Points | Local Folder                                       |
| --- | ---------- | -------------------------------------- | ------ | -------------------------------------------------- |
| 6.1 | **FIN-19** | Ver balance mensual                    | 3      | `STORY-FIN-19-view-monthly-balance/`               |
| 6.2 | **FIN-20** | Ver gastos por categoria               | 3      | `STORY-FIN-20-view-expenses-by-category/`          |
| 6.3 | **FIN-21** | Ver resumen de deudas activas          | 3      | `STORY-FIN-21-view-active-debts-summary/`          |
| 6.4 | **FIN-22** | Ver progreso de metas                  | 3      | `STORY-FIN-22-view-savings-goals-progress/`        |
| 6.5 | **FIN-23** | Ver proximos cargos de suscripciones   | 3      | `STORY-FIN-23-view-upcoming-subscription-charges/` |
| 6.6 | **FIN-24** | Ver comparativa mes actual vs anterior | 3      | `STORY-FIN-24-view-monthly-comparison/`            |

---

## Epic Prioritization

### Phase 1: Foundation (Sprint 1-2)

| Order | Epic                        | Jira Key | Stories | Points | Rationale                                                 |
| ----- | --------------------------- | -------- | ------- | ------ | --------------------------------------------------------- |
| 1     | EPIC 1: Authentication      | FIN-1    | 5       | 11     | Prerequisito para todo - sin auth no hay usuarios         |
| 2     | EPIC 2: Transactions        | FIN-7    | 7       | 18     | Core functionality - razon principal de usar la app       |
| 3     | EPIC 6: Dashboard (partial) | FIN-15   | 2       | 6      | Balance y gastos por categoria (depende de transacciones) |

### Phase 2: Core Features (Sprint 3-4)

| Order | Epic                        | Jira Key | Stories | Points | Rationale                                 |
| ----- | --------------------------- | -------- | ------- | ------ | ----------------------------------------- |
| 4     | EPIC 3: Debt Control        | FIN-16   | 7       | 18     | Feature diferenciador - control de deudas |
| 5     | EPIC 6: Dashboard (partial) | FIN-15   | 1       | 3      | Resumen de deudas (depende de EPIC 3)     |
| 6     | EPIC 4: Savings Goals       | FIN-17   | 7       | 19     | Feature motivacional - metas visuales     |
| 7     | EPIC 6: Dashboard (partial) | FIN-15   | 1       | 3      | Progreso de metas (depende de EPIC 4)     |

### Phase 3: Completion (Sprint 5-6)

| Order | Epic                      | Jira Key | Stories | Points | Rationale                     |
| ----- | ------------------------- | -------- | ------- | ------ | ----------------------------- |
| 8     | EPIC 5: Subscriptions     | FIN-18   | 6       | 15     | Control de gastos recurrentes |
| 9     | EPIC 6: Dashboard (final) | FIN-15   | 2       | 6      | Proximos cargos y comparativa |

---

## Dependencies Map

```
EPIC 1: Authentication (FIN-1)
    └── Blocks: ALL other epics (prerequisite)

EPIC 2: Transactions (FIN-7)
    ├── Depends on: EPIC 1 (FIN-1)
    └── Blocks: EPIC 6 (FIN-19, FIN-20, FIN-24)

EPIC 3: Debt Control (FIN-16)
    ├── Depends on: EPIC 1 (FIN-1)
    └── Blocks: EPIC 6 (FIN-21)

EPIC 4: Savings Goals (FIN-17)
    ├── Depends on: EPIC 1 (FIN-1)
    └── Blocks: EPIC 6 (FIN-22)

EPIC 5: Subscriptions (FIN-18)
    ├── Depends on: EPIC 1 (FIN-1)
    └── Blocks: EPIC 6 (FIN-23)

EPIC 6: Dashboard (FIN-15)
    └── Depends on: EPIC 1, EPIC 2, EPIC 3, EPIC 4, EPIC 5
```

---

## Jira Issues Summary

| Type                 | ID Range                                     | Count  |
| -------------------- | -------------------------------------------- | ------ |
| Epics                | FIN-1, FIN-7, FIN-15, FIN-16, FIN-17, FIN-18 | 6      |
| Auth Stories         | FIN-2 to FIN-6                               | 5      |
| Transaction Stories  | FIN-8 to FIN-14                              | 7      |
| Dashboard Stories    | FIN-19 to FIN-24                             | 6      |
| Debt Stories         | FIN-25 to FIN-31                             | 7      |
| Savings Stories      | FIN-32 to FIN-38                             | 7      |
| Subscription Stories | FIN-39 to FIN-44                             | 6      |
| **TOTAL**            | FIN-1 to FIN-44                              | **44** |

---

## Predefined Categories (10)

| Category        | Icon            | Color (suggested) |
| --------------- | --------------- | ----------------- |
| Alimentacion    | utensils        | #F59E0B (amber)   |
| Transporte      | car             | #3B82F6 (blue)    |
| Entretenimiento | film            | #8B5CF6 (violet)  |
| Salud           | heart           | #EF4444 (red)     |
| Educacion       | book            | #10B981 (emerald) |
| Hogar           | home            | #6366F1 (indigo)  |
| Ropa            | shirt           | #EC4899 (pink)    |
| Tecnologia      | laptop          | #6B7280 (gray)    |
| Servicios       | zap             | #F97316 (orange)  |
| Otros           | more-horizontal | #9CA3AF (gray)    |

---

## Story Points Summary

| Epic           | Jira Key | Stories | Points | % of Total |
| -------------- | -------- | ------- | ------ | ---------- |
| Authentication | FIN-1    | 5       | 11     | 11%        |
| Transactions   | FIN-7    | 7       | 18     | 18%        |
| Debt Control   | FIN-16   | 7       | 18     | 18%        |
| Savings Goals  | FIN-17   | 7       | 19     | 19%        |
| Subscriptions  | FIN-18   | 6       | 15     | 15%        |
| Dashboard      | FIN-15   | 6       | 18     | 18%        |
| **TOTAL**      | -        | **38**  | **99** | **100%**   |

**Velocity Assumption:** 20-25 points per sprint (2-week sprints)
**Estimated Duration:** 5-6 sprints (10-12 weeks)

---

## Completion Status

- [x] EPIC 1: Authentication - Created in Jira and documented locally
- [x] EPIC 2: Transactions - Created in Jira and documented locally
- [x] EPIC 3: Debt Control - Created in Jira and documented locally
- [x] EPIC 4: Savings Goals - Created in Jira and documented locally
- [x] EPIC 5: Subscriptions - Created in Jira and documented locally
- [x] EPIC 6: Dashboard - Created in Jira and documented locally

---

## Related Documentation

- **PRD:** `.context/PRD/mvp-scope.md`
- **SRS:** `.context/SRS/functional-specs.md`
- **Architecture:** `.context/SRS/architecture-specs.md`
- **API Contracts:** `.context/SRS/api-contracts.yaml`
- **User Journeys:** `.context/PRD/user-journeys.md`

---

_Document generated: 2025-01-24_
_Last updated: 2025-01-25_
_Version: 2.0 - All Jira IDs assigned_
