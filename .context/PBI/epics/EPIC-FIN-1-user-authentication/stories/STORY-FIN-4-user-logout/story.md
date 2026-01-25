# Cierre de Sesion

**Jira Key:** FIN-4
**Epic:** FIN-1 (Autenticacion y Gestion de Usuario)
**Priority:** High
**Story Points:** 1
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario autenticado
**I want to** cerrar sesion
**So that** pueda proteger mi informacion cuando no estoy usando la app

---

## Description

Implementar el cierre de sesion que invalida el JWT token actual, limpia las cookies de sesion, limpia el estado de la aplicacion (TanStack Query cache) y redirige al usuario a la pagina de login.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Logout exitoso (Happy Path)

```gherkin
Given estoy autenticado en mi cuenta
And estoy en cualquier pagina del dashboard
When hago clic en "Cerrar sesion"
Then mi sesion debe ser terminada en Supabase
And las cookies de tokens deben ser eliminadas
And el cache de TanStack Query debe ser limpiado
And debo ser redirigido a la pagina de login
And no debo poder acceder a rutas protegidas
```

### Scenario 2: Cookies limpiadas despues del logout (Security)

```gherkin
Given he cerrado sesion exitosamente
When intento acceder al dashboard directamente via URL "/dashboard"
Then debo ser redirigido a la pagina de login
And no debo ver ninguna informacion de mi cuenta anterior
```

### Scenario 3: Logout de sesion expirada (Edge Case)

```gherkin
Given mi access token ha expirado (despues de 1 hora)
And mi refresh token aun es valido
When intento realizar cualquier accion protegida
Then el sistema debe intentar refrescar el token
And si falla, debo ser deslogueado automaticamente
And debo ver el mensaje "Sesion expirada. Por favor inicia sesion nuevamente"
```

### Scenario 4: Logout desde menu de usuario

```gherkin
Given estoy autenticado
When hago clic en mi avatar/nombre en el header
Then debo ver un dropdown menu
And el menu debe contener la opcion "Cerrar sesion"
When hago clic en "Cerrar sesion"
Then debo ser deslogueado exitosamente
```

---

## Technical Notes

### Frontend

- **Componente:** `LogoutButton.tsx` en `/src/components/auth/`
- **Ubicacion:** Header (dropdown menu de usuario) y Sidebar
- **Estado:** Limpiar TanStack Query cache con `queryClient.clear()`
- **Redirect:** Usar `router.push('/login')` de Next.js

**data-testid:**

- `logout-button` - Boton de logout
- `user-menu` - Dropdown menu de usuario
- `user-menu-logout` - Opcion de logout en dropdown

### Backend

- **API Route:** `POST /api/auth/logout`
- **Supabase:** `supabase.auth.signOut()`
- **Cookies:** Clear HTTP-only cookies (access_token, refresh_token)

**Request:** No body required (usa cookies para identificar sesion)

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "message": "Sesion cerrada exitosamente"
  }
}
```

### State Management

```typescript
// Limpiar cache al logout
const handleLogout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  queryClient.clear(); // Limpiar TanStack Query cache
  router.push('/login');
};
```

### Cookie Cleanup

```typescript
// API Route debe limpiar cookies
cookies().delete('access_token');
cookies().delete('refresh_token');
```

---

## Dependencies

### Blocked By

- FIN-3: User Login (necesita sesion activa para logout)

### Blocks

- Ninguna

### Related Stories

- FIN-3: User Login (flujo complementario)

---

## UI/UX Considerations

- Boton de logout accesible desde cualquier pagina (header)
- No requiere confirmacion (accion simple y reversible)
- Feedback visual durante logout (loading spinner breve)
- Redirect inmediato a login
- Opcionalmente mostrar toast "Sesion cerrada"

---

## Definition of Done

- [ ] Codigo implementado y funcionando
- [ ] Tests unitarios
- [ ] Tests E2E con Playwright (4 scenarios)
- [ ] Session invalidation verificada
- [ ] Code review aprobado
- [ ] Deployed to staging
- [ ] QA testing passed

---

## Testing Strategy

**Test Cases Expected:** 5+ test cases

1. TC-001: Logout exitoso desde dashboard
2. TC-002: Cookies eliminadas post-logout
3. TC-003: Cache de TanStack Query limpiado
4. TC-004: Redirect a login post-logout
5. TC-005: Acceso denegado a rutas protegidas post-logout

---

## Notes

- Logout es una operacion simple pero critica para seguridad
- Asegurar que todos los datos sensibles se limpian del cliente
- El logout debe funcionar incluso si el backend falla (limpiar cookies localmente)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-003)

---

_Document created: 2025-01-24_
