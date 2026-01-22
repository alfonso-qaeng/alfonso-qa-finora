# User Journeys — Finora

> Flujos de usuario principales del MVP

*Version: 1.0 | MVP | Fecha: Enero 2025*

---

## Journey 1: Registro y Primer Gasto

> El camino del nuevo usuario desde el registro hasta registrar su primera transacción.

### Metadata

| Atributo | Valor |
|----------|-------|
| **Persona** | Valentina — La Joven Profesional |
| **Épicas relacionadas** | EPIC-FIN-001 (Auth), EPIC-FIN-002 (Transacciones) |
| **User Stories** | US 1.1, US 2.1, US 6.1 |
| **Tipo** | Happy Path |

### Scenario

Valentina descubre Finora a través de un post en Instagram sobre apps de finanzas simples. Entra a la landing page, le gusta el mensaje "Tu finanzas, simplificadas" y decide probar. Quiere registrar el almuerzo que acaba de pagar.

---

### Steps

#### Step 1: Landing y decisión de registro

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Valentina entra a finora.app, lee el tagline y hace clic en "Crear cuenta gratis" |
| **System Response** | Muestra formulario de registro con campos: email, contraseña, confirmar contraseña |
| **Pain Point** | Si el formulario pide demasiados datos (nombre, teléfono, etc.), puede abandonar |

#### Step 2: Completar registro

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Ingresa email y contraseña (min 8 caracteres), hace clic en "Registrarme" |
| **System Response** | Valida campos, crea cuenta, muestra mensaje "Cuenta creada. Revisa tu email para verificar" |
| **Pain Point** | Si la validación de contraseña es muy estricta (símbolos obligatorios), puede frustrarse |

#### Step 3: Verificación de email (opcional en MVP)

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Abre email, hace clic en enlace de verificación |
| **System Response** | Verifica email, redirige al dashboard con mensaje "Email verificado" |
| **Pain Point** | Si el email tarda más de 30 segundos o va a spam, puede abandonar |

#### Step 4: Primer login y onboarding

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Es redirigida al dashboard (o inicia sesión si cerró la pestaña) |
| **System Response** | Muestra dashboard vacío con mensaje de bienvenida y CTA "Registra tu primer gasto" |
| **Pain Point** | Dashboard vacío sin guía puede confundir; necesita orientación clara |

#### Step 5: Registrar primer gasto

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Hace clic en "Nuevo gasto", ingresa: $85 MXN, categoría "Alimentación", descripción "Almuerzo" |
| **System Response** | Guarda transacción, actualiza dashboard mostrando balance negativo -$85 |
| **Pain Point** | Si el formulario tiene muchos campos obligatorios, puede sentirlo tedioso |

#### Step 6: Ver resultado en dashboard

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Ve el dashboard actualizado con su primer gasto registrado |
| **System Response** | Muestra balance mensual, gasto por categoría (100% alimentación), y mensaje motivador |
| **Pain Point** | Si solo ve "-$85" sin contexto, puede no entender el valor de seguir usando la app |

---

### Expected Outcome

Valentina tiene su cuenta creada y su primer gasto registrado. Ve el dashboard con su balance mensual y entiende que la app funciona. Siente que fue fácil y rápido (menos de 2 minutos desde landing hasta primer gasto).

---

### Alternative Paths / Edge Cases

| Escenario | Comportamiento esperado |
|-----------|------------------------|
| **Email ya registrado** | Mostrar error "Este email ya tiene una cuenta. ¿Quieres iniciar sesión?" con link a login |
| **Contraseña muy débil** | Mostrar validación en tiempo real indicando requisitos faltantes |
| **Error de red durante registro** | Mostrar mensaje "No pudimos crear tu cuenta. Intenta de nuevo" con botón retry |
| **Usuario cierra pestaña antes de verificar** | Permitir login sin verificar (con banner recordando verificar email) |
| **Monto de gasto inválido (negativo o $0)** | Mostrar error inline "El monto debe ser mayor a $0" |

---

## Journey 2: Crear Meta de Ahorro y Registrar Aportación

> El flujo de un usuario que quiere empezar a ahorrar para un objetivo específico.

### Metadata

| Atributo | Valor |
|----------|-------|
| **Persona** | Andrés — El Freelancer |
| **Épicas relacionadas** | EPIC-FIN-004 (Metas), EPIC-FIN-006 (Dashboard) |
| **User Stories** | US 4.1, US 4.2, US 4.3, US 6.4 |
| **Tipo** | Happy Path |

### Scenario

Andrés lleva 2 semanas usando Finora para trackear sus ingresos como freelancer. Quiere ahorrar $2,500 USD para una MacBook nueva en 8 meses. Decide crear una meta de ahorro.

---

### Steps

#### Step 1: Navegar a sección de metas

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Desde el dashboard, hace clic en "Metas" en el menú lateral (o tab) |
| **System Response** | Muestra página de metas vacía con CTA "Crea tu primera meta de ahorro" |
| **Pain Point** | Si la navegación no es clara, puede no encontrar la sección |

#### Step 2: Crear nueva meta

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Hace clic en "Nueva meta", ingresa: nombre "MacBook Pro", monto $2,500, fecha límite "Septiembre 2025" |
| **System Response** | Valida datos, crea meta, muestra card de meta con progreso 0% y monto restante $2,500 |
| **Pain Point** | Si el date picker es confuso o no permite fechas lejanas, frustra al usuario |

#### Step 3: Ver meta creada

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Ve la meta creada con barra de progreso vacía y sugerencia de aportación mensual ($312.50/mes) |
| **System Response** | Muestra meta con visualización clara: barra de progreso, monto actual/objetivo, días restantes |
| **Pain Point** | Si no hay indicador de cuánto aportar por mes para cumplir, el usuario no tiene guía |

#### Step 4: Registrar primera aportación

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Hace clic en "Agregar aportación", ingresa $500 |
| **System Response** | Registra aportación, actualiza progreso a 20%, muestra mensaje "¡Gran inicio! 20% completado" |
| **Pain Point** | Si el feedback no es inmediato y visual, no siente la gratificación |

#### Step 5: Ver progreso en dashboard

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Vuelve al dashboard para ver el resumen general |
| **System Response** | Dashboard muestra widget de metas con "MacBook Pro: 20% ($500 de $2,500)" |
| **Pain Point** | Si las metas no aparecen en el dashboard, pierde visibilidad diaria |

---

### Expected Outcome

Andrés tiene una meta de ahorro creada con su primera aportación registrada. Ve el progreso tanto en la página de metas como en el dashboard. Se siente motivado al ver el 20% completado y sabe cuánto debe aportar mensualmente.

---

### Alternative Paths / Edge Cases

| Escenario | Comportamiento esperado |
|-----------|------------------------|
| **Fecha límite en el pasado** | Mostrar error "La fecha límite debe ser futura" |
| **Monto objetivo $0 o negativo** | Mostrar error "El monto debe ser mayor a $0" |
| **Aportación mayor al restante** | Permitir pero mostrar warning "Esta aportación completará tu meta. ¿Confirmas?" |
| **Usuario intenta crear meta sin nombre** | Campo nombre requerido, mostrar error inline |
| **Meta alcanza 100%** | Cambiar estado a "Completada", mostrar celebración visual, mover a historial |

---

## Journey 3: Registrar Deuda y Pago Parcial

> El flujo de un usuario que quiere trackear una deuda de tarjeta de crédito.

### Metadata

| Atributo | Valor |
|----------|-------|
| **Persona** | Valentina — La Joven Profesional |
| **Épicas relacionadas** | EPIC-FIN-003 (Deudas), EPIC-FIN-006 (Dashboard) |
| **User Stories** | US 3.1, US 3.2, US 3.3, US 3.4, US 6.3 |
| **Tipo** | Happy Path |

### Scenario

Valentina tiene $15,000 MXN de deuda en su tarjeta de crédito. Quiere registrarla en Finora para trackear su progreso mientras la paga. Acaba de hacer un pago de $3,000 MXN.

---

### Steps

#### Step 1: Navegar a sección de deudas

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Desde el dashboard, hace clic en "Deudas" en el menú |
| **System Response** | Muestra página de deudas vacía con CTA "Registra tu primera deuda para no perderla de vista" |
| **Pain Point** | El lenguaje "registra tu deuda" puede sentirse negativo; usar tono motivador |

#### Step 2: Registrar deuda

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Hace clic en "Nueva deuda", ingresa: acreedor "Tarjeta BBVA", monto $15,000, fecha vencimiento "15 del mes" |
| **System Response** | Crea deuda, muestra card con saldo pendiente $15,000 y días hasta vencimiento |
| **Pain Point** | Si no puede indicar que es mensual (TC), la fecha de vencimiento única no sirve |

#### Step 3: Registrar pago parcial

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Hace clic en "Registrar pago" en la card de la deuda, ingresa $3,000 |
| **System Response** | Registra pago, actualiza saldo a $12,000, muestra "¡Bien! Redujiste tu deuda un 20%" |
| **Pain Point** | Si el pago no se refleja inmediatamente en el saldo, genera confusión |

#### Step 4: Ver historial de pagos

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Hace clic en la deuda para ver detalle y historial |
| **System Response** | Muestra timeline de pagos: "Pago $3,000 — Hace 5 min", saldo inicial, saldo actual |
| **Pain Point** | Si no hay historial, pierde trazabilidad de su progreso |

#### Step 5: Ver resumen en dashboard

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Vuelve al dashboard |
| **System Response** | Widget de deudas muestra "Deudas activas: $12,000" con próximo vencimiento |
| **Pain Point** | Si no hay alerta visual de vencimiento próximo, puede olvidar pagar |

---

### Expected Outcome

Valentina tiene su deuda de TC registrada con el primer pago trackeable. Ve el saldo actualizado y el historial de pagos. El dashboard le recuerda cuánto debe y cuándo vence.

---

### Alternative Paths / Edge Cases

| Escenario | Comportamiento esperado |
|-----------|------------------------|
| **Pago mayor al saldo pendiente** | Mostrar warning "El pago excede el saldo. ¿Quieres registrar solo $12,000?" |
| **Intenta eliminar deuda con pagos registrados** | Confirmar: "Esta deuda tiene X pagos registrados. ¿Segura que quieres eliminarla?" |
| **Deuda con saldo $0** | Marcar como "Pagada" automáticamente, mostrar celebración, mover a historial |
| **Múltiples deudas activas** | Mostrar lista ordenada por próximo vencimiento, highlight en deudas por vencer en 7 días |
| **Usuario edita monto original después de pagos** | Recalcular saldo pendiente, mantener historial de pagos intacto |

---

## Journey 4: Gestionar Suscripciones

> El flujo de un usuario que quiere registrar y visualizar sus suscripciones recurrentes.

### Metadata

| Atributo | Valor |
|----------|-------|
| **Persona** | Carmen — La Simplificadora |
| **Épicas relacionadas** | EPIC-FIN-005 (Suscripciones), EPIC-FIN-006 (Dashboard) |
| **User Stories** | US 5.1, US 5.2, US 5.3, US 6.5 |
| **Tipo** | Happy Path |

### Scenario

Carmen sospecha que su familia paga por demasiados servicios de streaming. Quiere registrar todas sus suscripciones para ver cuánto gastan en total y cuáles podrían cancelar.

---

### Steps

#### Step 1: Navegar a suscripciones

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Desde el dashboard, hace clic en "Suscripciones" |
| **System Response** | Muestra página vacía con "¿Sabes cuánto pagas en suscripciones? Registra tus servicios" |
| **Pain Point** | Si tiene que buscar la sección, puede frustrarse |

#### Step 2: Registrar primera suscripción

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Hace clic en "Nueva suscripción", ingresa: "Netflix", €12.99/mes, próximo cobro 5 de febrero |
| **System Response** | Guarda suscripción, muestra en lista con fecha de próximo cobro |
| **Pain Point** | Si no puede elegir frecuencia (mensual/anual), limita utilidad |

#### Step 3: Registrar más suscripciones

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Repite para HBO Max (€8.99), Disney+ (€8.99), Amazon Prime (€49.99/año), Spotify (€10.99) |
| **System Response** | Actualiza lista y total mensual en tiempo real |
| **Pain Point** | Si tiene que hacer muchos clics por cada una, se vuelve tedioso |

#### Step 4: Ver total mensual

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Revisa el resumen de suscripciones |
| **System Response** | Muestra "Total mensual: €46.12" (Netflix + HBO + Disney + Prime prorrateado + Spotify) |
| **Pain Point** | Si Prime anual no se prorratea a mensual, el total no es útil |

#### Step 5: Identificar suscripción a cancelar

| Aspecto | Detalle |
|---------|---------|
| **User Action** | Ve que HBO Max casi no lo usan, decide cancelarlo. Marca como "Cancelada" |
| **System Response** | Actualiza estado, recalcula total mensual a €37.13, muestra "Ahorro: €8.99/mes" |
| **Pain Point** | Si cancelar no es fácil o no muestra impacto, no ve el beneficio |

---

### Expected Outcome

Carmen tiene todas sus suscripciones registradas, ve el total mensual real, y al cancelar HBO Max entiende cuánto ahorrará. El dashboard le muestra próximos cobros para anticipar.

---

### Alternative Paths / Edge Cases

| Escenario | Comportamiento esperado |
|-----------|------------------------|
| **Suscripción con cobro hoy** | Highlight especial "Cobro hoy", color distintivo |
| **Suscripción anual** | Mostrar tanto monto anual como equivalente mensual |
| **Fecha de cobro pasada sin actualizar** | Avanzar automáticamente a próxima fecha según frecuencia |
| **Usuario intenta registrar monto $0** | Error: "El monto debe ser mayor a $0" |
| **Muchas suscripciones (10+)** | Permitir scroll, mostrar total siempre visible en header |

---

## Resumen de Journeys

| Journey | Persona | Épicas | User Stories | Tipo |
|---------|---------|--------|--------------|------|
| Registro y primer gasto | Valentina | 001, 002 | 1.1, 2.1, 6.1 | Happy Path |
| Meta de ahorro + aportación | Andrés | 004, 006 | 4.1-4.3, 6.4 | Happy Path |
| Deuda + pago parcial | Valentina | 003, 006 | 3.1-3.4, 6.3 | Happy Path |
| Gestionar suscripciones | Carmen | 005, 006 | 5.1-5.4, 6.5 | Happy Path |

---

*Documento generado para: `.context/PRD/user-journeys.md`*
*Última actualización: Enero 2025*
