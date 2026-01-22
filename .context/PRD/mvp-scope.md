# MVP Scope — Finora

> Alcance del Producto Mínimo Viable

*Version: 1.0 | MVP | Fecha: Enero 2025*

---

## 1. In Scope (Must Have)

### EPIC-FIN-001: Autenticación y Gestión de Usuario

> Permitir a los usuarios registrarse, iniciar sesión y gestionar su cuenta de forma segura.

| ID | User Story |
|----|------------|
| **US 1.1** | Como usuario, quiero **registrarme con mi email y contraseña** para crear mi cuenta en Finora |
| **US 1.2** | Como usuario, quiero **iniciar sesión con mis credenciales** para acceder a mi cuenta |
| **US 1.3** | Como usuario, quiero **cerrar sesión** para proteger mi información cuando no uso la app |
| **US 1.4** | Como usuario, quiero **recuperar mi contraseña** si la olvido para volver a acceder a mi cuenta |
| **US 1.5** | Como usuario, quiero **editar mi perfil** (nombre, moneda preferida) para personalizar mi experiencia |

---

### EPIC-FIN-002: Gestión de Transacciones (Gastos e Ingresos)

> Permitir a los usuarios registrar, categorizar y visualizar sus transacciones financieras.

| ID | User Story |
|----|------------|
| **US 2.1** | Como usuario, quiero **registrar un gasto** con monto, categoría, fecha y descripción para trackear mis egresos |
| **US 2.2** | Como usuario, quiero **registrar un ingreso** con monto, fuente, fecha y descripción para trackear mis entradas de dinero |
| **US 2.3** | Como usuario, quiero **ver la lista de mis transacciones** ordenadas por fecha para revisar mi historial |
| **US 2.4** | Como usuario, quiero **filtrar transacciones** por tipo (ingreso/gasto), categoría y rango de fechas para encontrar movimientos específicos |
| **US 2.5** | Como usuario, quiero **editar una transacción existente** para corregir errores |
| **US 2.6** | Como usuario, quiero **eliminar una transacción** que registré por error |
| **US 2.7** | Como usuario, quiero **seleccionar categorías predefinidas** (alimentación, transporte, entretenimiento, etc.) para clasificar mis gastos |

---

### EPIC-FIN-003: Control de Deudas

> Permitir a los usuarios registrar deudas, trackear pagos parciales y recibir alertas de vencimiento.

| ID | User Story |
|----|------------|
| **US 3.1** | Como usuario, quiero **registrar una deuda** con monto total, acreedor, fecha de vencimiento y descripción para no olvidar lo que debo |
| **US 3.2** | Como usuario, quiero **registrar un pago parcial** a una deuda para actualizar el saldo pendiente |
| **US 3.3** | Como usuario, quiero **ver el historial de pagos** de una deuda para revisar mi progreso |
| **US 3.4** | Como usuario, quiero **ver la lista de mis deudas activas** con saldo pendiente y próximo vencimiento para tener visibilidad de mis compromisos |
| **US 3.5** | Como usuario, quiero **marcar una deuda como pagada** cuando liquido el saldo total |
| **US 3.6** | Como usuario, quiero **editar los datos de una deuda** para corregir información |
| **US 3.7** | Como usuario, quiero **eliminar una deuda** registrada por error |

---

### EPIC-FIN-004: Metas de Ahorro

> Permitir a los usuarios crear metas de ahorro, registrar aportaciones y visualizar progreso.

| ID | User Story |
|----|------------|
| **US 4.1** | Como usuario, quiero **crear una meta de ahorro** con nombre, monto objetivo y fecha límite para definir mis objetivos |
| **US 4.2** | Como usuario, quiero **registrar una aportación** a una meta para incrementar mi ahorro |
| **US 4.3** | Como usuario, quiero **ver el progreso visual** de mi meta (barra de progreso, porcentaje) para motivarme a seguir ahorrando |
| **US 4.4** | Como usuario, quiero **ver la lista de mis metas** con progreso actual para tener visibilidad de todos mis objetivos |
| **US 4.5** | Como usuario, quiero **editar una meta** (nombre, monto, fecha) para ajustar mis objetivos |
| **US 4.6** | Como usuario, quiero **eliminar una meta** que ya no es relevante |
| **US 4.7** | Como usuario, quiero **marcar una meta como completada** cuando alcanzo el objetivo |

---

### EPIC-FIN-005: Gestión de Suscripciones

> Permitir a los usuarios registrar suscripciones recurrentes, ver próximos cargos y detectar gastos innecesarios.

| ID | User Story |
|----|------------|
| **US 5.1** | Como usuario, quiero **registrar una suscripción** con nombre, monto, frecuencia (mensual/anual) y fecha de próximo cargo para trackear mis pagos recurrentes |
| **US 5.2** | Como usuario, quiero **ver la lista de mis suscripciones activas** con monto y próxima fecha de cobro para tener visibilidad de mis compromisos fijos |
| **US 5.3** | Como usuario, quiero **ver el total mensual de suscripciones** para entender cuánto gasto en servicios recurrentes |
| **US 5.4** | Como usuario, quiero **marcar una suscripción como cancelada** para actualizar mi lista |
| **US 5.5** | Como usuario, quiero **editar los datos de una suscripción** para actualizar montos o fechas |
| **US 5.6** | Como usuario, quiero **eliminar una suscripción** registrada por error |

---

### EPIC-FIN-006: Dashboard y Reportes

> Proveer una vista consolidada del estado financiero del usuario con métricas clave.

| ID | User Story |
|----|------------|
| **US 6.1** | Como usuario, quiero **ver mi balance mensual** (ingresos - gastos) para entender mi situación financiera actual |
| **US 6.2** | Como usuario, quiero **ver mis gastos agrupados por categoría** para identificar en qué gasto más |
| **US 6.3** | Como usuario, quiero **ver un resumen de mis deudas activas** en el dashboard para no olvidar compromisos |
| **US 6.4** | Como usuario, quiero **ver el progreso de mis metas de ahorro** en el dashboard para motivarme |
| **US 6.5** | Como usuario, quiero **ver los próximos cargos de suscripciones** para anticipar gastos |
| **US 6.6** | Como usuario, quiero **ver una comparativa de gastos** entre el mes actual y el anterior para identificar tendencias |

---

## 2. Out of Scope (Nice to Have — v2+)

### Funcionalidades Diferidas

| Feature | Razón | Prioridad Post-MVP |
|---------|-------|-------------------|
| **Conexión con bancos (Open Banking)** | Complejidad de integraciones, fricción de usuario | Media |
| **Múltiples monedas con conversión automática** | Requiere API de tasas de cambio, complejidad | Baja |
| **Presupuestos por categoría** | Feature completo, requiere más UX research | Alta |
| **Categorización automática con IA** | Requiere ML, datos de entrenamiento | Media |
| **Exportación de datos (CSV, PDF)** | Feature premium, no crítico para MVP | Alta |
| **Notificaciones push** | Requiere infraestructura adicional | Alta |
| **Modo oscuro** | Nice to have, no afecta funcionalidad core | Media |
| **Multi-idioma (inglés)** | MVP enfocado en mercado hispanohablante | Media |
| **Reportes avanzados (gráficos, tendencias)** | Feature premium, MVP con dashboard básico | Alta |
| **Roles (admin, familia compartida)** | Complejidad de permisos, MVP single-user | Baja |
| **PWA / App nativa** | Web responsive primero, evaluar demanda | Media |
| **Recurring transactions automáticas** | Requiere lógica de scheduling | Alta |

### Mejoras Técnicas Diferidas

| Mejora | Razón |
|--------|-------|
| **Rate limiting avanzado** | Free tier de Supabase suficiente para MVP |
| **Caché de queries** | Optimización prematura para escala actual |
| **Logs centralizados** | Vercel logs suficiente para MVP |
| **A/B testing infrastructure** | Priorizar launch sobre experimentación |

---

## 3. Success Criteria

### Criterios de Aceptación del MVP

El MVP se considera **completo** cuando:

| # | Criterio | Verificación |
|---|----------|--------------|
| 1 | **Todas las User Stories implementadas** | Checklist de US con tests passing |
| 2 | **Cobertura de tests > 80%** | CI/CD pipeline con coverage report |
| 3 | **Performance: LCP < 2s** | Lighthouse score > 90 |
| 4 | **Accesibilidad: WCAG 2.1 AA** | axe-core audit sin errores críticos |
| 5 | **Sin bugs críticos o bloqueantes** | QA sign-off en todas las épicas |
| 6 | **Documentación completa** | README, API docs, architecture docs |

### Métricas de Lanzamiento

El MVP se considera **exitoso** si en los primeros 3 meses:

| Métrica | Target | Medición |
|---------|--------|----------|
| **Usuarios registrados** | 500+ | Supabase Auth dashboard |
| **Usuarios activos (MAU)** | 200+ | Users con transacciones en últimos 30 días |
| **Activation rate** | 40%+ | Users con 5+ transacciones en semana 1 |
| **Retention D30** | 25%+ | Users activos después de 30 días |
| **NPS** | > 30 | Survey in-app |

### Condiciones para Lanzamiento

| Condición | Estado Requerido |
|-----------|------------------|
| **Staging environment estable** | 72 horas sin incidentes |
| **Pruebas E2E passing** | 100% en pipeline CI |
| **Security audit básico** | Sin vulnerabilidades críticas (OWASP Top 10) |
| **Legal** | Términos de servicio y política de privacidad |
| **Landing page** | Página de marketing con signup |

---

## 4. Resumen de Épicas

| Epic ID | Nombre | User Stories | Prioridad |
|---------|--------|--------------|-----------|
| EPIC-FIN-001 | Autenticación | 5 | P0 (Critical) |
| EPIC-FIN-002 | Transacciones | 7 | P0 (Critical) |
| EPIC-FIN-003 | Deudas | 7 | P1 (High) |
| EPIC-FIN-004 | Metas de Ahorro | 7 | P1 (High) |
| EPIC-FIN-005 | Suscripciones | 6 | P1 (High) |
| EPIC-FIN-006 | Dashboard | 6 | P0 (Critical) |

**Total User Stories MVP**: 38

---

## 5. Categorías de Gastos (MVP)

Categorías predefinidas para transacciones:

| Categoría | Icono sugerido |
|-----------|----------------|
| Alimentación | utensils |
| Transporte | car |
| Entretenimiento | film |
| Salud | heart |
| Educación | book |
| Hogar | home |
| Ropa | shirt |
| Tecnología | laptop |
| Servicios (agua, luz, gas) | zap |
| Otros | more-horizontal |

---

*Documento generado para: `.context/PRD/mvp-scope.md`*
*Última actualización: Enero 2025*
