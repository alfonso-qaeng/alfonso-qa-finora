# Functional Specifications — Finora

> Especificaciones funcionales detalladas del MVP

*Version: 1.0 | MVP | Fecha: Enero 2025*

---

## Índice de Functional Requirements

| Rango | Épica | Cantidad |
|-------|-------|----------|
| FR-001 a FR-005 | EPIC-FIN-001: Autenticación | 5 |
| FR-006 a FR-012 | EPIC-FIN-002: Transacciones | 7 |
| FR-013 a FR-019 | EPIC-FIN-003: Deudas | 7 |
| FR-020 a FR-026 | EPIC-FIN-004: Metas de Ahorro | 7 |
| FR-027 a FR-032 | EPIC-FIN-005: Suscripciones | 6 |
| FR-033 a FR-038 | EPIC-FIN-006: Dashboard | 6 |

**Total: 38 Functional Requirements**

---

## EPIC-FIN-001: Autenticación y Gestión de Usuario

### FR-001: El sistema debe permitir registro de usuarios con email y contraseña

**Relacionado a:** EPIC-FIN-001, US 1.1

**Input:**
- `email` (string, formato RFC 5321, max 254 caracteres, requerido)
- `password` (string, min 8 caracteres, requerido)

**Processing:**
1. Validar formato de email (regex RFC 5321)
2. Validar longitud de contraseña (min 8 caracteres)
3. Verificar que email no existe en base de datos
4. Hash password con algoritmo bcrypt (Supabase Auth)
5. Crear registro de usuario en `auth.users` (Supabase)
6. Crear perfil de usuario en tabla `profiles` con defaults
7. Enviar email de verificación (opcional, configurable)

**Output:**
- **Success (201):** `{ success: true, user: { id, email, created_at } }`
- **Error (400):** `{ success: false, error: { code: "EMAIL_EXISTS", message: "Este email ya está registrado" } }`
- **Error (400):** `{ success: false, error: { code: "INVALID_EMAIL", message: "El formato de email es inválido" } }`
- **Error (400):** `{ success: false, error: { code: "WEAK_PASSWORD", message: "La contraseña debe tener al menos 8 caracteres" } }`

**Validations:**
- Email único en sistema
- Email formato válido
- Password >= 8 caracteres
- No campos vacíos

---

### FR-002: El sistema debe permitir inicio de sesión con credenciales

**Relacionado a:** EPIC-FIN-001, US 1.2

**Input:**
- `email` (string, requerido)
- `password` (string, requerido)

**Processing:**
1. Validar que email existe en sistema
2. Verificar password contra hash almacenado (Supabase Auth)
3. Generar token JWT de sesión
4. Crear registro de sesión activa

**Output:**
- **Success (200):** `{ success: true, session: { access_token, refresh_token, expires_at }, user: { id, email } }`
- **Error (401):** `{ success: false, error: { code: "INVALID_CREDENTIALS", message: "Email o contraseña incorrectos" } }`

**Validations:**
- Credenciales válidas
- Cuenta no suspendida
- Rate limiting: max 5 intentos por IP en 15 minutos

---

### FR-003: El sistema debe permitir cierre de sesión

**Relacionado a:** EPIC-FIN-001, US 1.3

**Input:**
- `Authorization` header con token JWT válido

**Processing:**
1. Validar token JWT
2. Invalidar sesión actual en Supabase
3. Limpiar cookies de sesión en cliente

**Output:**
- **Success (200):** `{ success: true, message: "Sesión cerrada correctamente" }`
- **Error (401):** `{ success: false, error: { code: "UNAUTHORIZED", message: "No hay sesión activa" } }`

**Validations:**
- Token válido y no expirado
- Sesión activa existe

---

### FR-004: El sistema debe permitir recuperación de contraseña

**Relacionado a:** EPIC-FIN-001, US 1.4

**Input:**
- `email` (string, requerido)

**Processing:**
1. Verificar que email existe en sistema
2. Generar token de recuperación (válido 1 hora)
3. Enviar email con enlace de recuperación
4. No revelar si el email existe o no (seguridad)

**Output:**
- **Success (200):** `{ success: true, message: "Si el email existe, recibirás instrucciones para recuperar tu contraseña" }`

**Validations:**
- Rate limiting: max 3 solicitudes por email en 1 hora
- Token expira en 1 hora

---

### FR-005: El sistema debe permitir edición de perfil de usuario

**Relacionado a:** EPIC-FIN-001, US 1.5

**Input:**
- `name` (string, max 100 caracteres, opcional)
- `currency_symbol` (string, max 5 caracteres, default "$", opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Validar datos de entrada
3. Actualizar registro en tabla `profiles`
4. Retornar perfil actualizado

**Output:**
- **Success (200):** `{ success: true, profile: { id, name, currency_symbol, updated_at } }`
- **Error (400):** `{ success: false, error: { code: "VALIDATION_ERROR", message: "..." } }`
- **Error (401):** `{ success: false, error: { code: "UNAUTHORIZED", message: "Sesión inválida" } }`

**Validations:**
- Usuario autenticado
- Nombre max 100 caracteres
- Currency symbol max 5 caracteres

---

## EPIC-FIN-002: Gestión de Transacciones

### FR-006: El sistema debe permitir registro de gastos

**Relacionado a:** EPIC-FIN-002, US 2.1

**Input:**
- `amount` (number, positivo, max 2 decimales, requerido)
- `category_id` (uuid, referencia a categoría existente, requerido)
- `description` (string, max 255 caracteres, opcional)
- `date` (date, formato ISO 8601, default hoy, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Validar monto > 0
3. Validar que categoría existe
4. Crear transacción con `type: "expense"`
5. Asociar a usuario autenticado (RLS)

**Output:**
- **Success (201):** `{ success: true, transaction: { id, type, amount, category_id, description, date, created_at } }`
- **Error (400):** `{ success: false, error: { code: "INVALID_AMOUNT", message: "El monto debe ser mayor a 0" } }`
- **Error (400):** `{ success: false, error: { code: "INVALID_CATEGORY", message: "La categoría no existe" } }`

**Validations:**
- Monto > 0
- Monto <= 999,999,999.99 (límite razonable)
- Categoría válida
- Fecha no futura (max hoy + 1 día por timezone)
- Usuario autenticado

---

### FR-007: El sistema debe permitir registro de ingresos

**Relacionado a:** EPIC-FIN-002, US 2.2

**Input:**
- `amount` (number, positivo, max 2 decimales, requerido)
- `source` (string, max 100 caracteres, opcional, ej: "Salario", "Freelance")
- `description` (string, max 255 caracteres, opcional)
- `date` (date, formato ISO 8601, default hoy, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Validar monto > 0
3. Crear transacción con `type: "income"`
4. Asociar a usuario autenticado (RLS)

**Output:**
- **Success (201):** `{ success: true, transaction: { id, type, amount, source, description, date, created_at } }`
- **Error (400):** `{ success: false, error: { code: "INVALID_AMOUNT", message: "El monto debe ser mayor a 0" } }`

**Validations:**
- Monto > 0
- Usuario autenticado

---

### FR-008: El sistema debe listar transacciones del usuario

**Relacionado a:** EPIC-FIN-002, US 2.3

**Input:**
- `page` (number, default 1, opcional)
- `limit` (number, default 20, max 100, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar transacciones del usuario (RLS automático)
3. Ordenar por fecha descendente (más reciente primero)
4. Paginar resultados

**Output:**
- **Success (200):** `{ success: true, transactions: [...], pagination: { page, limit, total, has_more } }`

**Validations:**
- Usuario autenticado
- Solo ve sus propias transacciones (RLS)

---

### FR-009: El sistema debe permitir filtrar transacciones

**Relacionado a:** EPIC-FIN-002, US 2.4

**Input:**
- `type` (enum: "income" | "expense" | "all", default "all", opcional)
- `category_id` (uuid, opcional)
- `date_from` (date, ISO 8601, opcional)
- `date_to` (date, ISO 8601, opcional)
- `page` (number, default 1)
- `limit` (number, default 20)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Aplicar filtros a query
3. Ordenar por fecha descendente
4. Paginar resultados

**Output:**
- **Success (200):** `{ success: true, transactions: [...], filters_applied: {...}, pagination: {...} }`

**Validations:**
- date_from <= date_to
- Categoría existe si se especifica
- Usuario autenticado

---

### FR-010: El sistema debe permitir edición de transacciones

**Relacionado a:** EPIC-FIN-002, US 2.5

**Input:**
- `transaction_id` (uuid, path param, requerido)
- `amount` (number, opcional)
- `category_id` (uuid, opcional)
- `description` (string, opcional)
- `date` (date, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que transacción pertenece al usuario (RLS)
3. Validar campos a actualizar
4. Actualizar registro
5. Actualizar `updated_at`

**Output:**
- **Success (200):** `{ success: true, transaction: { ...updated } }`
- **Error (404):** `{ success: false, error: { code: "NOT_FOUND", message: "Transacción no encontrada" } }`

**Validations:**
- Transacción existe y pertenece al usuario
- Campos válidos según FR-006/FR-007

---

### FR-011: El sistema debe permitir eliminación de transacciones

**Relacionado a:** EPIC-FIN-002, US 2.6

**Input:**
- `transaction_id` (uuid, path param, requerido)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que transacción pertenece al usuario (RLS)
3. Eliminar registro (soft delete o hard delete según política)

**Output:**
- **Success (200):** `{ success: true, message: "Transacción eliminada" }`
- **Error (404):** `{ success: false, error: { code: "NOT_FOUND", message: "Transacción no encontrada" } }`

**Validations:**
- Transacción existe y pertenece al usuario

---

### FR-012: El sistema debe proveer categorías predefinidas

**Relacionado a:** EPIC-FIN-002, US 2.7

**Input:**
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Retornar lista de categorías del sistema

**Output:**
- **Success (200):**
```json
{
  "success": true,
  "categories": [
    { "id": "uuid", "name": "Alimentación", "icon": "utensils", "color": "#FF6B6B" },
    { "id": "uuid", "name": "Transporte", "icon": "car", "color": "#4ECDC4" },
    { "id": "uuid", "name": "Entretenimiento", "icon": "film", "color": "#45B7D1" },
    { "id": "uuid", "name": "Salud", "icon": "heart", "color": "#96CEB4" },
    { "id": "uuid", "name": "Educación", "icon": "book", "color": "#FFEAA7" },
    { "id": "uuid", "name": "Hogar", "icon": "home", "color": "#DDA0DD" },
    { "id": "uuid", "name": "Ropa", "icon": "shirt", "color": "#98D8C8" },
    { "id": "uuid", "name": "Tecnología", "icon": "laptop", "color": "#7C73E6" },
    { "id": "uuid", "name": "Servicios", "icon": "zap", "color": "#F8B500" },
    { "id": "uuid", "name": "Otros", "icon": "more-horizontal", "color": "#95A5A6" }
  ]
}
```

**Validations:**
- Usuario autenticado
- Categorías son read-only (no CRUD por usuario en MVP)

---

## EPIC-FIN-003: Control de Deudas

### FR-013: El sistema debe permitir registro de deudas

**Relacionado a:** EPIC-FIN-003, US 3.1

**Input:**
- `total_amount` (number, positivo, requerido)
- `creditor` (string, max 100 caracteres, requerido)
- `due_date` (date, ISO 8601, opcional)
- `description` (string, max 255 caracteres, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Validar datos de entrada
3. Crear deuda con `status: "active"` y `paid_amount: 0`
4. Calcular `remaining_amount = total_amount`
5. Asociar a usuario (RLS)

**Output:**
- **Success (201):** `{ success: true, debt: { id, total_amount, paid_amount, remaining_amount, creditor, due_date, status, created_at } }`
- **Error (400):** `{ success: false, error: { code: "INVALID_AMOUNT", message: "El monto debe ser mayor a 0" } }`

**Validations:**
- total_amount > 0
- creditor no vacío
- Usuario autenticado

---

### FR-014: El sistema debe permitir registro de pagos parciales a deudas

**Relacionado a:** EPIC-FIN-003, US 3.2

**Input:**
- `debt_id` (uuid, path param, requerido)
- `amount` (number, positivo, requerido)
- `date` (date, ISO 8601, default hoy, opcional)
- `note` (string, max 255 caracteres, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que deuda existe y pertenece al usuario
3. Validar que monto <= remaining_amount
4. Crear registro en `debt_payments`
5. Actualizar `paid_amount` y `remaining_amount` en deuda
6. Si remaining_amount = 0, cambiar status a "paid"

**Output:**
- **Success (201):** `{ success: true, payment: { id, debt_id, amount, date }, debt: { ...updated } }`
- **Error (400):** `{ success: false, error: { code: "AMOUNT_EXCEEDS_REMAINING", message: "El pago excede el saldo pendiente" } }`

**Validations:**
- Deuda activa
- amount > 0
- amount <= remaining_amount (o warning si excede)
- Usuario autenticado

---

### FR-015: El sistema debe mostrar historial de pagos de una deuda

**Relacionado a:** EPIC-FIN-003, US 3.3

**Input:**
- `debt_id` (uuid, path param, requerido)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que deuda pertenece al usuario
3. Consultar pagos ordenados por fecha descendente

**Output:**
- **Success (200):** `{ success: true, debt: {...}, payments: [{ id, amount, date, note, created_at }, ...] }`
- **Error (404):** `{ success: false, error: { code: "NOT_FOUND", message: "Deuda no encontrada" } }`

**Validations:**
- Deuda existe y pertenece al usuario

---

### FR-016: El sistema debe listar deudas activas del usuario

**Relacionado a:** EPIC-FIN-003, US 3.4

**Input:**
- `status` (enum: "active" | "paid" | "all", default "active", opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar deudas del usuario (RLS)
3. Filtrar por status
4. Ordenar por due_date ascendente (próximas primero)

**Output:**
- **Success (200):** `{ success: true, debts: [...], summary: { total_active: number, total_remaining: number } }`

**Validations:**
- Usuario autenticado

---

### FR-017: El sistema debe permitir marcar deuda como pagada

**Relacionado a:** EPIC-FIN-003, US 3.5

**Input:**
- `debt_id` (uuid, path param, requerido)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que deuda pertenece al usuario
3. Cambiar status a "paid"
4. Si remaining_amount > 0, registrar pago final automático
5. Actualizar remaining_amount a 0

**Output:**
- **Success (200):** `{ success: true, debt: { ...updated, status: "paid" } }`

**Validations:**
- Deuda existe y está activa
- Usuario autenticado

---

### FR-018: El sistema debe permitir edición de deudas

**Relacionado a:** EPIC-FIN-003, US 3.6

**Input:**
- `debt_id` (uuid, path param, requerido)
- `creditor` (string, opcional)
- `due_date` (date, opcional)
- `description` (string, opcional)
- `total_amount` (number, opcional - con restricciones)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que deuda pertenece al usuario
3. Si se modifica total_amount, recalcular remaining_amount
4. Actualizar registro

**Output:**
- **Success (200):** `{ success: true, debt: { ...updated } }`

**Validations:**
- total_amount no puede ser menor a paid_amount
- Deuda existe y pertenece al usuario

---

### FR-019: El sistema debe permitir eliminación de deudas

**Relacionado a:** EPIC-FIN-003, US 3.7

**Input:**
- `debt_id` (uuid, path param, requerido)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que deuda pertenece al usuario
3. Eliminar pagos asociados (cascade)
4. Eliminar deuda

**Output:**
- **Success (200):** `{ success: true, message: "Deuda eliminada" }`

**Validations:**
- Deuda existe y pertenece al usuario
- Confirmación si tiene pagos registrados

---

## EPIC-FIN-004: Metas de Ahorro

### FR-020: El sistema debe permitir crear metas de ahorro

**Relacionado a:** EPIC-FIN-004, US 4.1

**Input:**
- `name` (string, max 100 caracteres, requerido)
- `target_amount` (number, positivo, requerido)
- `target_date` (date, ISO 8601, futuro, opcional)
- `description` (string, max 255 caracteres, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Validar datos de entrada
3. Crear meta con `current_amount: 0`, `status: "active"`
4. Calcular `suggested_monthly = target_amount / months_remaining`
5. Asociar a usuario (RLS)

**Output:**
- **Success (201):** `{ success: true, goal: { id, name, target_amount, current_amount, target_date, progress_percentage: 0, suggested_monthly, status, created_at } }`

**Validations:**
- target_amount > 0
- target_date > hoy (si se especifica)
- name no vacío
- Usuario autenticado

---

### FR-021: El sistema debe permitir registrar aportaciones a metas

**Relacionado a:** EPIC-FIN-004, US 4.2

**Input:**
- `goal_id` (uuid, path param, requerido)
- `amount` (number, positivo, requerido)
- `date` (date, ISO 8601, default hoy, opcional)
- `note` (string, max 255 caracteres, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que meta existe y pertenece al usuario
3. Crear registro en `goal_contributions`
4. Actualizar current_amount en meta
5. Recalcular progress_percentage
6. Si current_amount >= target_amount, sugerir marcar como completada

**Output:**
- **Success (201):** `{ success: true, contribution: { id, goal_id, amount, date }, goal: { ...updated, progress_percentage } }`

**Validations:**
- Meta activa
- amount > 0
- Usuario autenticado

---

### FR-022: El sistema debe mostrar progreso visual de metas

**Relacionado a:** EPIC-FIN-004, US 4.3

**Input:**
- `goal_id` (uuid, path param, requerido)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar meta con cálculos de progreso
3. Calcular: progress_percentage, remaining_amount, days_remaining, suggested_monthly

**Output:**
- **Success (200):**
```json
{
  "success": true,
  "goal": {
    "id": "uuid",
    "name": "MacBook Pro",
    "target_amount": 2500,
    "current_amount": 500,
    "remaining_amount": 2000,
    "progress_percentage": 20,
    "target_date": "2025-09-01",
    "days_remaining": 240,
    "suggested_monthly": 333.33,
    "contributions": [...]
  }
}
```

**Validations:**
- Meta existe y pertenece al usuario

---

### FR-023: El sistema debe listar metas del usuario

**Relacionado a:** EPIC-FIN-004, US 4.4

**Input:**
- `status` (enum: "active" | "completed" | "all", default "active", opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar metas del usuario (RLS)
3. Calcular progreso de cada meta
4. Ordenar por progress_percentage descendente

**Output:**
- **Success (200):** `{ success: true, goals: [...], summary: { total_active, total_saved, total_target } }`

**Validations:**
- Usuario autenticado

---

### FR-024: El sistema debe permitir edición de metas

**Relacionado a:** EPIC-FIN-004, US 4.5

**Input:**
- `goal_id` (uuid, path param, requerido)
- `name` (string, opcional)
- `target_amount` (number, opcional)
- `target_date` (date, opcional)
- `description` (string, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que meta pertenece al usuario
3. Actualizar campos
4. Recalcular progress_percentage si target_amount cambia

**Output:**
- **Success (200):** `{ success: true, goal: { ...updated } }`

**Validations:**
- target_amount no puede ser menor a current_amount
- target_date debe ser futura
- Meta existe y pertenece al usuario

---

### FR-025: El sistema debe permitir eliminación de metas

**Relacionado a:** EPIC-FIN-004, US 4.6

**Input:**
- `goal_id` (uuid, path param, requerido)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que meta pertenece al usuario
3. Eliminar aportaciones asociadas (cascade)
4. Eliminar meta

**Output:**
- **Success (200):** `{ success: true, message: "Meta eliminada" }`

**Validations:**
- Meta existe y pertenece al usuario

---

### FR-026: El sistema debe permitir marcar meta como completada

**Relacionado a:** EPIC-FIN-004, US 4.7

**Input:**
- `goal_id` (uuid, path param, requerido)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que meta pertenece al usuario
3. Cambiar status a "completed"
4. Registrar completed_at

**Output:**
- **Success (200):** `{ success: true, goal: { ...updated, status: "completed", completed_at } }`

**Validations:**
- Meta activa
- Opcionalmente validar current_amount >= target_amount

---

## EPIC-FIN-005: Gestión de Suscripciones

### FR-027: El sistema debe permitir registro de suscripciones

**Relacionado a:** EPIC-FIN-005, US 5.1

**Input:**
- `name` (string, max 100 caracteres, requerido)
- `amount` (number, positivo, requerido)
- `frequency` (enum: "monthly" | "yearly", requerido)
- `next_billing_date` (date, ISO 8601, requerido)
- `description` (string, max 255 caracteres, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Validar datos de entrada
3. Crear suscripción con `status: "active"`
4. Calcular `monthly_equivalent` (si anual: amount / 12)
5. Asociar a usuario (RLS)

**Output:**
- **Success (201):** `{ success: true, subscription: { id, name, amount, frequency, monthly_equivalent, next_billing_date, status, created_at } }`

**Validations:**
- amount > 0
- name no vacío
- frequency válida
- Usuario autenticado

---

### FR-028: El sistema debe listar suscripciones activas

**Relacionado a:** EPIC-FIN-005, US 5.2

**Input:**
- `status` (enum: "active" | "cancelled" | "all", default "active", opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar suscripciones del usuario (RLS)
3. Ordenar por next_billing_date ascendente

**Output:**
- **Success (200):** `{ success: true, subscriptions: [...], summary: { total_monthly, upcoming_7_days: [...] } }`

**Validations:**
- Usuario autenticado

---

### FR-029: El sistema debe calcular total mensual de suscripciones

**Relacionado a:** EPIC-FIN-005, US 5.3

**Input:**
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar suscripciones activas
3. Sumar monthly_equivalent de cada suscripción
4. Calcular total anual proyectado

**Output:**
- **Success (200):**
```json
{
  "success": true,
  "summary": {
    "total_monthly": 46.12,
    "total_yearly": 553.44,
    "count": 5,
    "breakdown": [
      { "name": "Netflix", "monthly": 12.99 },
      { "name": "Spotify", "monthly": 10.99 },
      ...
    ]
  }
}
```

**Validations:**
- Usuario autenticado
- Solo suscripciones activas

---

### FR-030: El sistema debe permitir marcar suscripción como cancelada

**Relacionado a:** EPIC-FIN-005, US 5.4

**Input:**
- `subscription_id` (uuid, path param, requerido)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que suscripción pertenece al usuario
3. Cambiar status a "cancelled"
4. Registrar cancelled_at

**Output:**
- **Success (200):** `{ success: true, subscription: { ...updated, status: "cancelled" }, monthly_savings: 12.99 }`

**Validations:**
- Suscripción activa
- Usuario autenticado

---

### FR-031: El sistema debe permitir edición de suscripciones

**Relacionado a:** EPIC-FIN-005, US 5.5

**Input:**
- `subscription_id` (uuid, path param, requerido)
- `name` (string, opcional)
- `amount` (number, opcional)
- `frequency` (enum, opcional)
- `next_billing_date` (date, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que suscripción pertenece al usuario
3. Actualizar campos
4. Recalcular monthly_equivalent si amount o frequency cambia

**Output:**
- **Success (200):** `{ success: true, subscription: { ...updated } }`

**Validations:**
- Suscripción existe y pertenece al usuario

---

### FR-032: El sistema debe permitir eliminación de suscripciones

**Relacionado a:** EPIC-FIN-005, US 5.6

**Input:**
- `subscription_id` (uuid, path param, requerido)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Verificar que suscripción pertenece al usuario
3. Eliminar registro

**Output:**
- **Success (200):** `{ success: true, message: "Suscripción eliminada" }`

**Validations:**
- Suscripción existe y pertenece al usuario

---

## EPIC-FIN-006: Dashboard y Reportes

### FR-033: El sistema debe mostrar balance mensual

**Relacionado a:** EPIC-FIN-006, US 6.1

**Input:**
- `month` (number, 1-12, default mes actual, opcional)
- `year` (number, default año actual, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar transacciones del mes/año especificado
3. Calcular total_income (sum ingresos)
4. Calcular total_expenses (sum gastos)
5. Calcular balance (income - expenses)

**Output:**
- **Success (200):**
```json
{
  "success": true,
  "balance": {
    "month": 1,
    "year": 2025,
    "total_income": 2500.00,
    "total_expenses": 1850.00,
    "balance": 650.00,
    "transaction_count": 47
  }
}
```

**Validations:**
- Usuario autenticado
- Mes/año válidos

---

### FR-034: El sistema debe mostrar gastos agrupados por categoría

**Relacionado a:** EPIC-FIN-006, US 6.2

**Input:**
- `month` (number, default mes actual, opcional)
- `year` (number, default año actual, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar gastos del período
3. Agrupar por categoría
4. Calcular porcentaje de cada categoría

**Output:**
- **Success (200):**
```json
{
  "success": true,
  "expenses_by_category": [
    { "category": "Alimentación", "amount": 450.00, "percentage": 24.3, "color": "#FF6B6B" },
    { "category": "Transporte", "amount": 380.00, "percentage": 20.5, "color": "#4ECDC4" },
    ...
  ],
  "total": 1850.00
}
```

**Validations:**
- Usuario autenticado

---

### FR-035: El sistema debe mostrar resumen de deudas activas

**Relacionado a:** EPIC-FIN-006, US 6.3

**Input:**
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar deudas activas
3. Calcular totales y próximos vencimientos

**Output:**
- **Success (200):**
```json
{
  "success": true,
  "debts_summary": {
    "total_active_debts": 2,
    "total_remaining": 15000.00,
    "next_due": {
      "creditor": "Tarjeta BBVA",
      "amount": 12000.00,
      "due_date": "2025-02-15",
      "days_until_due": 8
    },
    "debts": [...]
  }
}
```

**Validations:**
- Usuario autenticado

---

### FR-036: El sistema debe mostrar progreso de metas de ahorro en dashboard

**Relacionado a:** EPIC-FIN-006, US 6.4

**Input:**
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar metas activas (max 3 para dashboard)
3. Calcular progreso de cada una

**Output:**
- **Success (200):**
```json
{
  "success": true,
  "goals_summary": {
    "total_active_goals": 2,
    "total_saved": 1500.00,
    "total_target": 5000.00,
    "overall_progress": 30,
    "goals": [
      { "name": "MacBook Pro", "progress": 20, "current": 500, "target": 2500 },
      { "name": "Vacaciones", "progress": 40, "current": 1000, "target": 2500 }
    ]
  }
}
```

**Validations:**
- Usuario autenticado

---

### FR-037: El sistema debe mostrar próximos cargos de suscripciones

**Relacionado a:** EPIC-FIN-006, US 6.5

**Input:**
- `days_ahead` (number, default 30, max 90, opcional)
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar suscripciones activas con next_billing_date en rango
3. Ordenar por fecha

**Output:**
- **Success (200):**
```json
{
  "success": true,
  "upcoming_charges": {
    "total": 46.12,
    "subscriptions": [
      { "name": "Netflix", "amount": 12.99, "date": "2025-02-05", "days_until": 3 },
      { "name": "Spotify", "amount": 10.99, "date": "2025-02-10", "days_until": 8 },
      ...
    ]
  }
}
```

**Validations:**
- Usuario autenticado

---

### FR-038: El sistema debe mostrar comparativa de gastos mes actual vs anterior

**Relacionado a:** EPIC-FIN-006, US 6.6

**Input:**
- `Authorization` header con token JWT

**Processing:**
1. Validar token JWT
2. Consultar gastos del mes actual
3. Consultar gastos del mes anterior
4. Calcular diferencia y porcentaje de cambio
5. Identificar categorías con mayor variación

**Output:**
- **Success (200):**
```json
{
  "success": true,
  "comparison": {
    "current_month": {
      "month": "Febrero 2025",
      "total": 1850.00
    },
    "previous_month": {
      "month": "Enero 2025",
      "total": 2100.00
    },
    "difference": -250.00,
    "percentage_change": -11.9,
    "trend": "down",
    "top_changes": [
      { "category": "Entretenimiento", "change": -150.00, "percentage": -30 },
      { "category": "Alimentación", "change": +50.00, "percentage": +8 }
    ]
  }
}
```

**Validations:**
- Usuario autenticado
- Requiere al menos 1 transacción en cada mes para comparar

---

## Apéndice: Códigos de Error Estándar

| Código | HTTP Status | Descripción |
|--------|-------------|-------------|
| `UNAUTHORIZED` | 401 | No autenticado o token inválido |
| `FORBIDDEN` | 403 | Sin permisos para el recurso |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `VALIDATION_ERROR` | 400 | Datos de entrada inválidos |
| `EMAIL_EXISTS` | 400 | Email ya registrado |
| `INVALID_CREDENTIALS` | 401 | Email o contraseña incorrectos |
| `INVALID_AMOUNT` | 400 | Monto inválido |
| `AMOUNT_EXCEEDS_REMAINING` | 400 | Pago excede saldo pendiente |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

---

*Documento generado para: `.context/SRS/functional-specs.md`*
*Última actualización: Enero 2025*
