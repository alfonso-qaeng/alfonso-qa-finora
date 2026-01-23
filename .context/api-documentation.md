# API Documentation - Finora

## Overview

Finora usa **Supabase** como backend, lo que proporciona una API REST auto-generada para todas las tablas.

**Base URL:** `https://zmofqoilerozqoyabsid.supabase.co`

---

## Autenticación

Todas las requests requieren el header `Authorization` con un JWT token válido.

```
Authorization: Bearer <access_token>
```

### Obtener Token (Login)

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// data.session.access_token contiene el JWT
```

---

## Uso Recomendado: Supabase Client

En lugar de hacer requests HTTP directas, se recomienda usar el cliente de Supabase:

```typescript
// Browser
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

// Server (Next.js 15+)
import { createServerSupabaseClient } from '@/lib/supabase/server';
const supabase = await createServerSupabaseClient();
```

---

## Endpoints por Entidad

### Categories (Lectura)

```typescript
// Obtener todas las categorías
const { data: categories } = await supabase.from('categories').select('*').order('name');

// Tipo de respuesta
type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  is_system: boolean;
  created_at: string;
};
```

---

### Profiles

```typescript
// Obtener perfil del usuario actual
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single();

// Crear perfil (después de signup)
const { data, error } = await supabase
  .from('profiles')
  .insert({
    user_id: userId,
    name: 'John Doe',
    currency_symbol: '$',
  })
  .select()
  .single();

// Actualizar perfil
const { data, error } = await supabase
  .from('profiles')
  .update({ name: 'Jane Doe' })
  .eq('user_id', userId)
  .select()
  .single();
```

---

### Transactions

```typescript
// Listar transacciones (paginado)
const { data: transactions } = await supabase
  .from('transactions')
  .select(
    `
    *,
    category:categories(name, icon, color)
  `
  )
  .order('date', { ascending: false })
  .range(0, 19); // Primeras 20

// Filtrar por tipo
const { data: expenses } = await supabase.from('transactions').select('*').eq('type', 'expense');

// Filtrar por rango de fechas
const { data } = await supabase
  .from('transactions')
  .select('*')
  .gte('date', '2024-01-01')
  .lte('date', '2024-01-31');

// Crear transacción (gasto)
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    type: 'expense',
    amount: 50.0,
    category_id: categoryId,
    description: 'Almuerzo',
    date: '2024-01-15',
  })
  .select()
  .single();

// Crear transacción (ingreso)
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    type: 'income',
    amount: 3000.0,
    source: 'Salario',
    description: 'Pago mensual',
    date: '2024-01-01',
  })
  .select()
  .single();

// Actualizar transacción
const { data, error } = await supabase
  .from('transactions')
  .update({ amount: 55.0 })
  .eq('id', transactionId)
  .select()
  .single();

// Eliminar transacción
const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
```

---

### Debts

```typescript
// Listar deudas activas
const { data: debts } = await supabase
  .from('debts')
  .select('*')
  .eq('status', 'active')
  .order('due_date', { ascending: true });

// Crear deuda
const { data, error } = await supabase
  .from('debts')
  .insert({
    user_id: userId,
    total_amount: 1000.0,
    creditor: 'Banco XYZ',
    description: 'Préstamo personal',
    due_date: '2024-12-31',
  })
  .select()
  .single();

// Registrar pago a deuda
const { data: payment, error } = await supabase
  .from('debt_payments')
  .insert({
    debt_id: debtId,
    amount: 100.0,
    date: '2024-01-15',
    note: 'Pago mensual',
  })
  .select()
  .single();

// Actualizar monto pagado de la deuda
const { error } = await supabase
  .from('debts')
  .update({
    paid_amount: newPaidAmount,
    status: newPaidAmount >= totalAmount ? 'paid' : 'active',
  })
  .eq('id', debtId);

// Obtener historial de pagos
const { data: payments } = await supabase
  .from('debt_payments')
  .select('*')
  .eq('debt_id', debtId)
  .order('date', { ascending: false });
```

---

### Goals

```typescript
// Listar metas activas
const { data: goals } = await supabase
  .from('goals')
  .select('*')
  .eq('status', 'active')
  .order('target_date', { ascending: true });

// Crear meta
const { data, error } = await supabase
  .from('goals')
  .insert({
    user_id: userId,
    name: 'Vacaciones',
    target_amount: 5000.0,
    target_date: '2024-12-01',
    description: 'Viaje a Europa',
  })
  .select()
  .single();

// Registrar aportación
const { data: contribution, error } = await supabase
  .from('goal_contributions')
  .insert({
    goal_id: goalId,
    amount: 500.0,
    date: '2024-01-15',
    note: 'Ahorro mensual',
  })
  .select()
  .single();

// Actualizar monto actual de la meta
const { error } = await supabase
  .from('goals')
  .update({
    current_amount: newCurrentAmount,
    status: newCurrentAmount >= targetAmount ? 'completed' : 'active',
    completed_at: newCurrentAmount >= targetAmount ? new Date().toISOString() : null,
  })
  .eq('id', goalId);

// Obtener historial de aportaciones
const { data: contributions } = await supabase
  .from('goal_contributions')
  .select('*')
  .eq('goal_id', goalId)
  .order('date', { ascending: false });
```

---

### Subscriptions

```typescript
// Listar suscripciones activas
const { data: subscriptions } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('status', 'active')
  .order('next_billing_date', { ascending: true });

// Crear suscripción
const { data, error } = await supabase
  .from('subscriptions')
  .insert({
    user_id: userId,
    name: 'Netflix',
    amount: 15.99,
    frequency: 'monthly',
    next_billing_date: '2024-02-01',
    description: 'Plan estándar',
  })
  .select()
  .single();

// Cancelar suscripción
const { error } = await supabase
  .from('subscriptions')
  .update({
    status: 'cancelled',
    cancelled_at: new Date().toISOString(),
  })
  .eq('id', subscriptionId);

// Calcular total mensual de suscripciones
const { data } = await supabase
  .from('subscriptions')
  .select('amount, frequency')
  .eq('status', 'active');

const monthlyTotal = data?.reduce((sum, sub) => {
  return sum + (sub.frequency === 'yearly' ? sub.amount / 12 : sub.amount);
}, 0);
```

---

## Queries Comunes para Dashboard

### Resumen del Mes

```typescript
const startOfMonth = '2024-01-01';
const endOfMonth = '2024-01-31';

// Ingresos del mes
const { data: incomes } = await supabase
  .from('transactions')
  .select('amount')
  .eq('type', 'income')
  .gte('date', startOfMonth)
  .lte('date', endOfMonth);

const totalIncome = incomes?.reduce((sum, t) => sum + t.amount, 0) || 0;

// Gastos del mes
const { data: expenses } = await supabase
  .from('transactions')
  .select('amount')
  .eq('type', 'expense')
  .gte('date', startOfMonth)
  .lte('date', endOfMonth);

const totalExpenses = expenses?.reduce((sum, t) => sum + t.amount, 0) || 0;

// Balance
const balance = totalIncome - totalExpenses;
```

### Gastos por Categoría

```typescript
const { data } = await supabase
  .from('transactions')
  .select(
    `
    amount,
    category:categories(name, color)
  `
  )
  .eq('type', 'expense')
  .gte('date', startOfMonth)
  .lte('date', endOfMonth);

// Agrupar por categoría
const byCategory = data?.reduce(
  (acc, t) => {
    const catName = t.category?.name || 'Sin categoría';
    acc[catName] = (acc[catName] || 0) + t.amount;
    return acc;
  },
  {} as Record<string, number>
);
```

---

## Manejo de Errores

```typescript
const { data, error } = await supabase.from('transactions').select('*');

if (error) {
  // error.message - Mensaje de error
  // error.code - Código de error PostgreSQL
  // error.details - Detalles adicionales
  console.error('Error:', error.message);
  return;
}

// data está disponible aquí
```

### Códigos de Error Comunes

| Código     | Descripción           | Solución                |
| ---------- | --------------------- | ----------------------- |
| `PGRST301` | Row not found         | El registro no existe   |
| `23503`    | Foreign key violation | La referencia no existe |
| `23505`    | Unique violation      | El valor ya existe      |
| `42501`    | RLS policy violation  | Usuario no autorizado   |

---

## Tipos TypeScript

Los tipos se generan automáticamente desde el schema:

```typescript
import type { Database } from '@/types/supabase';

// Tipo de una fila
type Transaction = Database['public']['Tables']['transactions']['Row'];

// Tipo para insertar
type NewTransaction = Database['public']['Tables']['transactions']['Insert'];

// Tipo para actualizar
type UpdateTransaction = Database['public']['Tables']['transactions']['Update'];

// ENUMs
type TransactionType = Database['public']['Enums']['transaction_type'];
```

---

## Rate Limits

Supabase tiene los siguientes límites por defecto:

- **Requests:** 500/segundo
- **Payload:** 6MB máximo
- **Conexiones DB:** 60 simultáneas

Para el MVP estos límites son más que suficientes.
