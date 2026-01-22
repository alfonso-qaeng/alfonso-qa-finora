# Executive Summary — Finora

> **Finora — Tu Finanzas, Simplificadas**

*Version: 1.0 | MVP | Fecha: Enero 2025*

---

## 1. Problem Statement

### Pain Point Crítico

La gestión de finanzas personales es un desafío cotidiano para millones de personas. La mayoría no tiene claridad sobre:

- **Cuánto gastan realmente** cada mes
- **Cuánto deben** y cuándo vencen sus pagos
- **Cuánto podrían ahorrar** si tuvieran visibilidad de sus hábitos financieros
- **Suscripciones olvidadas** que se renuevan automáticamente sin uso

### Impacto en el Usuario

Las soluciones existentes (Mint, YNAB, Fintonic) presentan barreras significativas:

| Barrera | Consecuencia |
|---------|--------------|
| Requieren vincular cuentas bancarias | Fricción inicial alta, desconfianza en seguridad de datos |
| Interfaces sobrecargadas | Curva de aprendizaje pronunciada, abandono temprano |
| Metodologías complejas (ej: YNAB) | Requieren compromiso de tiempo que usuarios no tienen |
| Precio elevado | Barrera económica para usuarios que más necesitan la herramienta |

**Resultado**: Abandono temprano de herramientas financieras y vuelta a la improvisación.

---

## 2. Solution Overview

**Finora** ofrece una herramienta de finanzas personales **simple, visual y sin fricción**, donde el usuario tiene control total de sus datos sin necesidad de integraciones externas.

### Features Core del MVP

| # | Feature | Descripción |
|---|---------|-------------|
| 1 | **Registro rápido de transacciones** | Gastos e ingresos en menos de 10 segundos, categorización simple |
| 2 | **Dashboard visual** | Vista clara del balance mensual, gastos por categoría, tendencias |
| 3 | **Control de deudas** | Registro de deudas con pagos parciales, fechas de vencimiento, alertas |
| 4 | **Metas de ahorro visuales** | Progreso visual con aportaciones trackeable, motivación gamificada |
| 5 | **Gestor de suscripciones** | Registro de pagos recurrentes, alertas de renovación, detección de gastos innecesarios |

### Cómo Resuelve el Problema

- **Sin conexión bancaria**: Control total de datos, cero fricción de onboarding
- **UI minimalista**: Entiende tu situación financiera de un vistazo
- **Entrada en segundos**: Micro-interacciones optimizadas para registro rápido
- **Valor inmediato**: Desde el primer gasto registrado, el usuario ve su balance

---

## 3. Success Metrics

### Métricas de Adopción

| Métrica | Definición | Target MVP (3 meses) |
|---------|------------|----------------------|
| **MAU** | Usuarios activos mensuales | 500 usuarios |
| **Registros** | Usuarios nuevos por mes | 200/mes |
| **Activation Rate** | % usuarios con 5+ transacciones en semana 1 | 40% |

### Métricas de Engagement

| Métrica | Definición | Target MVP |
|---------|------------|------------|
| **Retention D7** | % usuarios activos después de 7 días | 35% |
| **Retention D30** | % usuarios activos después de 30 días | 25% |
| **Transacciones/Usuario** | Promedio de transacciones por usuario activo/mes | 15+ |
| **Features Adoption** | % usuarios usando 2+ features (metas, deudas, suscripciones) | 30% |

### Métricas de Negocio

| Métrica | Definición | Target MVP |
|---------|------------|------------|
| **Conversion Rate** | % free → premium | 5% |
| **MRR** | Monthly Recurring Revenue | $125 (25 usuarios × $4.99) |
| **NPS** | Net Promoter Score | > 30 |

---

## 4. Target Users

### Persona 1: Joven Adulto

| Atributo | Descripción |
|----------|-------------|
| **Perfil** | Profesional 22-30 años, primeros trabajos estables |
| **Situación** | Comenzando a manejar ingresos propios, sin educación financiera formal |
| **Pain Point Principal** | No sabe por dónde empezar, apps complejas lo abruman |
| **Necesita** | Herramienta simple que le dé visibilidad sin requerir conocimiento previo |

### Persona 2: Freelancer / Independiente

| Atributo | Descripción |
|----------|-------------|
| **Perfil** | Trabajador independiente, 25-40 años, múltiples fuentes de ingreso |
| **Situación** | Ingresos variables mes a mes, dificultad para proyectar |
| **Pain Point Principal** | No puede planificar con ingresos irregulares |
| **Necesita** | Visibilidad de flujo de caja, tracking de ingresos por fuente |

### Persona 3: Simplificador

| Atributo | Descripción |
|----------|-------------|
| **Perfil** | Usuario 28-45 años que probó apps como Mint/YNAB y las abandonó |
| **Situación** | Quiere control financiero pero sin complejidad |
| **Pain Point Principal** | Busca algo simple, sin conexión bancaria, sin curva de aprendizaje |
| **Necesita** | Herramienta minimalista que funcione desde día 1 |

---

## 5. Positioning Statement

> **Para** jóvenes adultos y personas que buscan claridad financiera sin complicaciones,
> **Finora** es una app de finanzas personales
> **que** permite registrar gastos, controlar deudas, ahorrar con metas visuales y gestionar suscripciones
> **a diferencia de** apps tradicionales que requieren conexión bancaria o metodologías complejas,
> **nuestro producto** ofrece simplicidad radical, control total de datos y una experiencia visual que se entiende en segundos.

---

## 6. Tech Stack (MVP)

| Capa | Tecnología |
|------|------------|
| **Frontend** | Next.js 15 (App Router) + TypeScript + TailwindCSS + Shadcn/ui |
| **Backend** | Next.js API Routes / Server Actions |
| **Database** | Supabase (PostgreSQL + Auth + RLS) |
| **Hosting** | Vercel |
| **CI/CD** | GitHub Actions |
| **Testing** | Playwright (E2E), Vitest (Unit), Postman (API) |

---

*Documento generado para: `.context/PRD/executive-summary.md`*
*Última actualización: Enero 2025*
