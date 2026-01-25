# Edicion de Perfil de Usuario

**Jira Key:** FIN-6
**Epic:** FIN-1 (Autenticacion y Gestion de Usuario)
**Priority:** Medium
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** editar mi perfil (nombre, moneda preferida)
**So that** pueda personalizar mi experiencia en Finora

---

## Description

Implementar la pagina de perfil donde el usuario puede actualizar su nombre de display y su simbolo de moneda preferido. Los cambios se guardan en la tabla profiles de Supabase con Row Level Security (RLS) para asegurar que cada usuario solo puede editar su propio perfil.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Actualizar nombre de display (Happy Path)

```gherkin
Given estoy autenticado
And navego a mi pagina de perfil "/settings/profile"
When cambio mi nombre a "Juan Garcia"
And hago clic en "Guardar"
Then mi nombre debe ser actualizado en la base de datos
And debo ver el mensaje "Perfil actualizado exitosamente"
And mi nombre debe aparecer en el header de la aplicacion
```

### Scenario 2: Cambiar simbolo de moneda preferido (Happy Path)

```gherkin
Given estoy en mi pagina de perfil
And mi moneda actual es "$"
When selecciono el simbolo de moneda "EUR"
And hago clic en "Guardar"
Then mi preferencia de moneda debe ser guardada
And todos los montos en la aplicacion deben mostrarse con "EUR"
And debo ver el mensaje "Perfil actualizado exitosamente"
```

### Scenario 3: Validacion de longitud del nombre (Error Case)

```gherkin
Given estoy editando mi perfil
When ingreso un nombre de mas de 100 caracteres
Then debo ver el error "El nombre no puede exceder 100 caracteres"
And el boton guardar debe estar deshabilitado
And el cambio no debe guardarse
```

### Scenario 4: Nombre vacio permitido (Edge Case)

```gherkin
Given estoy editando mi perfil
And actualmente tengo un nombre "Juan Garcia"
When limpio el campo de nombre (lo dejo vacio)
And hago clic en "Guardar"
Then mi perfil debe guardarse sin nombre
And en el header debe aparecer mi email o un icono generico
```

### Scenario 5: Cancelar cambios sin guardar

```gherkin
Given estoy en mi pagina de perfil
And he modificado el nombre pero no he guardado
When hago clic en "Cancelar" o navego a otra pagina
Then los cambios no guardados deben descartarse
And mi perfil debe mantener los valores anteriores
```

---

## Technical Notes

### Frontend

- **Componente:** `ProfileForm.tsx` en `/src/components/settings/`
- **Pagina:** `/settings/profile` (App Router: `src/app/(app)/settings/profile/page.tsx`)
- **Estado:** React Hook Form con valores iniciales del perfil
- **Fetch:** TanStack Query para GET y mutate para PATCH

**data-testid:**

- `profile-form` - Formulario de perfil
- `profile-name` - Input de nombre
- `profile-currency` - Selector de moneda
- `profile-save` - Boton guardar
- `profile-cancel` - Boton cancelar
- `profile-success` - Mensaje de exito
- `profile-error` - Mensaje de error

### Backend

**API Routes:**

- `GET /api/auth/profile` - Obtener perfil actual
- `PATCH /api/auth/profile` - Actualizar perfil

**Request (PATCH):**

```json
{
  "name": "Juan Garcia",
  "currency_symbol": "EUR"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Juan Garcia",
    "currency_symbol": "EUR",
    "updated_at": "2025-01-24T..."
  }
}
```

### Database

**Tabla:** `public.profiles`

- `id` (uuid, PK)
- `user_id` (uuid, FK -> auth.users, unique)
- `name` (varchar 100, nullable)
- `currency_symbol` (varchar 10, default '$')
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS Policy:**

```sql
-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);
```

### Currency Symbols Available

| Symbol | Description                |
| ------ | -------------------------- |
| $      | USD / MXN / otros          |
| EUR    | Euro                       |
| GBP    | Libra Esterlina            |
| COP    | Peso Colombiano (usando $) |
| ARS    | Peso Argentino (usando $)  |

---

## Dependencies

### Blocked By

- FIN-2: User Registration (necesita perfil creado)
- FIN-3: User Login (necesita sesion activa)

### Blocks

- Ninguna (feature independiente)

### Related Stories

- FIN-2: User Registration (crea perfil inicial)

---

## UI/UX Considerations

- Formulario simple y limpio
- Valores actuales pre-cargados
- Feedback inmediato de validacion
- Toast de confirmacion al guardar
- Dropdown para seleccionar moneda
- Mostrar preview de como se vera el nombre en el header

### Wireframe

```
+----------------------------------+
|  Configuracion > Perfil          |
+----------------------------------+
|                                  |
|  Nombre de Display               |
|  +----------------------------+  |
|  | Juan Garcia                |  |
|  +----------------------------+  |
|                                  |
|  Moneda Preferida               |
|  +----------------------------+  |
|  | $ (USD/MXN)            v   |  |
|  +----------------------------+  |
|                                  |
|  [Cancelar]  [Guardar Cambios]   |
|                                  |
+----------------------------------+
```

---

## Definition of Done

- [ ] Formulario de perfil implementado
- [ ] GET y PATCH API routes funcionando
- [ ] RLS policies configuradas
- [ ] Validaciones front y backend
- [ ] Tests unitarios y E2E (5 scenarios)
- [ ] Code review aprobado
- [ ] Deployed to staging
- [ ] QA testing passed

---

## Testing Strategy

**Test Cases Expected:** 6+ test cases

1. TC-001: Actualizar nombre exitosamente
2. TC-002: Actualizar moneda exitosamente
3. TC-003: Validacion de nombre muy largo
4. TC-004: Guardar perfil sin nombre
5. TC-005: RLS - no puede editar perfil de otro usuario
6. TC-006: Cancelar cambios no guardados

---

## Notes

- El nombre es opcional, el email se usa como fallback en UI
- La moneda afecta solo la visualizacion, no conversiones
- Considerar agregar mas campos en post-MVP (avatar, timezone)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-005)

---

_Document created: 2025-01-24_
