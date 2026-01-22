# Business Model Canvas — Finora

> **Finora — Tu Finanzas, Simplificadas**

---

## Problem Statement

La gestión de finanzas personales es un desafío cotidiano para millones de personas. La mayoría no tiene claridad sobre cuánto gastan realmente cada mes, cuánto deben y cuándo vencen sus pagos, ni cuánto podrían ahorrar si tuvieran visibilidad de sus hábitos financieros. Este problema se agrava con las suscripciones digitales: servicios que se renuevan automáticamente y que muchas veces ya no se utilizan.

Las soluciones existentes en el mercado (Mint, YNAB, Fintonic, etc.) tienden a ser complejas, requieren vincular cuentas bancarias —lo que genera fricción y desconfianza— o están sobrecargadas de funcionalidades que abruman al usuario promedio. El resultado: abandono temprano de la herramienta y vuelta a la improvisación financiera.

Finora nace para resolver este gap: ofrecer una herramienta de finanzas personales **simple, visual y sin fricción**, donde el usuario tenga control total de sus datos sin necesidad de integraciones externas. Un enfoque minimalista que prioriza la claridad sobre la complejidad.

---

## MVP Hypothesis

1. **H1 — Adopción por simplicidad**: Los usuarios que abandonaron apps financieras complejas adoptarán Finora si pueden registrar transacciones en menos de 10 segundos y ver su balance mensual en un dashboard limpio.

2. **H2 — Retención por valor visible**: Los usuarios que registran al menos 10 transacciones en su primer mes tendrán un 60%+ de retención al segundo mes, debido al valor inmediato de ver sus gastos categorizados.

3. **H3 — Conversión a premium por funcionalidades de ahorro**: Los usuarios que crean al menos una meta de ahorro y una alerta de suscripción serán 3x más propensos a convertir a un plan premium.

---

## Business Model Canvas

### 1. Customer Segments

| Segmento | Descripción | Pain Points |
|----------|-------------|-------------|
| **Jóvenes adultos (22-30)** | Primeros trabajos, comenzando a manejar ingresos propios | No saben por dónde empezar, apps complejas los abruman |
| **Freelancers / Independientes** | Ingresos variables, múltiples fuentes de ingreso | Dificultad para proyectar y planificar con ingresos irregulares |
| **Simplificadores** | Usuarios que probaron apps como Mint/YNAB y las abandonaron | Buscan algo simple, sin conexión bancaria, sin curva de aprendizaje |
| **Ahorradores aspiracionales** | Quieren ahorrar pero no tienen método | Necesitan visualización de progreso y motivación |

**Segmento primario MVP**: Jóvenes adultos y simplificadores en Latinoamérica y España.

---

### 2. Value Propositions

| Propuesta | Beneficio |
|-----------|-----------|
| **Simplicidad radical** | Registra ingresos/gastos en segundos, sin fricción |
| **Sin conexión bancaria** | Control total de datos, sin riesgos de seguridad |
| **Dashboard visual** | Entiende tu situación financiera de un vistazo |
| **Control de deudas** | Sabe cuánto debes y cuándo pagar, evita atrasos |
| **Metas de ahorro visuales** | Progreso claro que motiva a seguir ahorrando |
| **Gestor de suscripciones** | Detecta gastos recurrentes y evita pagos innecesarios |

**Propuesta core**: "Claridad financiera sin complejidad"

---

### 3. Channels

| Canal | Tipo | Uso |
|-------|------|-----|
| **Landing page + SEO** | Owned | Adquisición orgánica, conversión a registro |
| **Product Hunt / Indie Hackers** | Earned | Lanzamiento MVP, early adopters |
| **Content marketing (blog)** | Owned | SEO long-tail, educación financiera básica |
| **Redes sociales (TikTok, IG)** | Owned | Contenido educativo corto sobre finanzas personales |
| **Referidos in-app** | Owned | Crecimiento viral entre usuarios |

---

### 4. Customer Relationships

| Tipo | Descripción |
|------|-------------|
| **Self-service** | Onboarding guiado, tooltips, documentación |
| **Comunidad** | Discord/Slack para early adopters y feedback |
| **Automatizado** | Emails de onboarding, recordatorios de uso |
| **Soporte básico** | Email/chat para usuarios premium |

---

### 5. Revenue Streams

| Modelo | Descripción | Precio estimado |
|--------|-------------|-----------------|
| **Freemium** | Funcionalidades básicas gratuitas (gastos, ingresos, dashboard) | $0 |
| **Premium mensual** | Metas ilimitadas, alertas de suscripciones, exportación de datos, reportes avanzados | $4.99/mes |
| **Premium anual** | Descuento por compromiso anual | $39.99/año (~$3.33/mes) |

**Modelo MVP**: Freemium con límites suaves (ej: 2 metas de ahorro, 5 suscripciones).

---

### 6. Key Resources

| Recurso | Tipo |
|---------|------|
| **Plataforma web (SaaS)** | Tecnológico |
| **Base de datos de usuarios** | Datos |
| **Marca y UX minimalista** | Intangible |
| **Equipo de desarrollo** | Humano |
| **Contenido educativo** | Intelectual |

---

### 7. Key Activities

| Actividad | Descripción |
|-----------|-------------|
| **Desarrollo de producto** | Iteración continua basada en feedback |
| **Adquisición de usuarios** | Marketing de contenidos, SEO, lanzamientos |
| **Retención** | Mejora de UX, notificaciones inteligentes |
| **Soporte** | Atención a usuarios premium |
| **QA y testing** | Asegurar calidad del SUT (objetivo del proyecto) |

---

### 8. Key Partners

| Partner | Valor |
|---------|-------|
| **Supabase** | Backend-as-a-Service, autenticación, base de datos |
| **Vercel/Netlify** | Hosting y deploy continuo |
| **Stripe** | Procesamiento de pagos para premium |
| **Comunidades fintech** | Distribución y feedback (ej: finanzas personales en Reddit/Discord) |
| **Influencers de educación financiera** | Alcance a audiencia target |

---

### 9. Cost Structure

| Costo | Tipo | Estimado mensual (MVP) |
|-------|------|------------------------|
| **Infraestructura (Supabase, hosting)** | Variable | $0-50 (free tiers) |
| **Dominio y SSL** | Fijo | $15/año |
| **Desarrollo** | Fijo (tiempo) | N/A (proyecto personal/QA) |
| **Marketing inicial** | Variable | $0-100 |
| **Herramientas (diseño, analytics)** | Fijo | $0-30 |

**Total MVP**: <$100/mes en fase inicial.

---

## Tech Stack (MVP)

| Capa | Tecnología |
|------|------------|
| **Frontend** | React + TypeScript + TailwindCSS |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Hosting** | Vercel |
| **Pagos** | Stripe (futuro) |
| **Testing** | Playwright (E2E), Vitest (Unit), Postman (API) |

---

## Métricas Clave (North Star)

| Métrica | Descripción | Target MVP |
|---------|-------------|------------|
| **MAU** | Usuarios activos mensuales | 500 en 3 meses |
| **Activation rate** | % usuarios que registran 5+ transacciones en semana 1 | 40% |
| **Retention D30** | % usuarios activos después de 30 días | 25% |
| **Conversion to premium** | % free → paid | 5% |

---

*Documento generado para: `.context/idea/business-model.md`*
*Última actualización: 2025-01*
