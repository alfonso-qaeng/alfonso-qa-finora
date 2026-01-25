# Inicio de Sesion con Credenciales

**Jira Key:** FIN-3
**Epic:** FIN-1 (Autenticacion y Gestion de Usuario)
**Priority:** High
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario registrado
**I want to** iniciar sesion con mis credenciales
**So that** pueda acceder a mi cuenta y ver mi informacion financiera

---

## Description

Implementar el flujo de login con email y contrasena. El sistema debe validar credenciales contra Supabase Auth, generar JWT tokens (access token 1hr, refresh token 7 dias), almacenarlos en HTTP-only cookies y redirigir al dashboard.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Login exitoso con credenciales validas (Happy Path)

```gherkin
Given tengo una cuenta registrada con email "user@example.com"
And mi contrasena es "SecurePass123"
When estoy en la pagina de login
And ingreso email "user@example.com"
And ingreso contrasena "SecurePass123"
And hago clic en "Iniciar sesion"
Then debo ser autenticado exitosamente
And debo recibir un access token (expira en 1 hora)
And debo recibir un refresh token (expira en 7 dias)
And debo ser redirigido al dashboard
And debo ver mi balance de cuenta
```

### Scenario 2: Login con contrasena incorrecta (Error Case)

```gherkin
Given tengo una cuenta registrada con email "user@example.com"
When estoy en la pagina de login
And ingreso email "user@example.com"
And ingreso una contrasena incorrecta "WrongPassword"
And hago clic en "Iniciar sesion"
Then debo ver el error "Email o contrasena incorrectos"
And debo permanecer en la pagina de login
And no debo recibir tokens
```

### Scenario 3: Login con email no registrado (Error Case)

```gherkin
Given el email "nonexistent@example.com" no esta registrado
When estoy en la pagina de login
And ingreso email "nonexistent@example.com"
And ingreso cualquier contrasena
And hago clic en "Iniciar sesion"
Then debo ver el error "Email o contrasena incorrectos"
And el mensaje debe ser generico para evitar enumeracion de emails
```

### Scenario 4: Rate limiting despues de multiples intentos fallidos (Security)

```gherkin
Given he fallado el login 5 veces en los ultimos 15 minutos
When intento iniciar sesion nuevamente
Then debo ver el mensaje "Demasiados intentos. Intenta de nuevo en X minutos"
And el login no debe proceder
And debo esperar antes de reintentar
```

### Scenario 5: Redirect a pagina original despues de login

```gherkin
Given intente acceder a "/dashboard/goals" sin autenticacion
And fui redirigido a la pagina de login
When inicio sesion exitosamente
Then debo ser redirigido a "/dashboard/goals"
And no al dashboard por defecto
```

---

## Technical Notes

### Frontend

- **Componente:** `LoginForm.tsx` en `/src/components/auth/`
- **Pagina:** `/login` (App Router: `src/app/(auth)/login/page.tsx`)
- **Validacion:** Zod schema para email y password
- **Estado:** React Hook Form
- **Redirect:** Guardar `returnUrl` en query params o sessionStorage

**data-testid:**

- `login-form` - Formulario completo
- `login-email` - Input de email
- `login-password` - Input de password
- `login-submit` - Boton de submit
- `login-error` - Mensaje de error
- `login-forgot-password` - Link a recuperacion
- `login-register-link` - Link a registro

### Backend

- **API Route:** `POST /api/auth/login`
- **Supabase:** `supabase.auth.signInWithPassword()`
- **Cookies:** Set HTTP-only cookies para tokens

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "session": {
      "access_token": "jwt...",
      "refresh_token": "jwt...",
      "expires_at": 1234567890
    }
  }
}
```

**Response Error (401):**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email o contrasena incorrectos"
  }
}
```

### Security

- Rate limit: 5 intentos / 15 minutos por IP
- Tokens almacenados en HTTP-only cookies (no localStorage)
- Access token: 1 hora TTL
- Refresh token: 7 dias TTL
- Mensajes de error genericos (no revelar si email existe)

---

## Dependencies

### Blocked By

- FIN-2: User Registration (necesita usuarios para login)

### Blocks

- Todas las rutas protegidas del sistema
- FIN-4: User Logout
- FIN-6: Edit Profile

### Related Stories

- FIN-2: User Registration
- FIN-4: User Logout
- FIN-5: Password Recovery

---

## UI/UX Considerations

- Formulario centrado, minimalista
- Link "Olvidaste tu contrasena?" visible
- Link a registro para nuevos usuarios
- Password visibility toggle
- Loading state durante autenticacion
- Remember me checkbox (opcional, post-MVP)
- Autofocus en campo email

---

## Definition of Done

- [ ] Codigo implementado y funcionando
- [ ] Tests unitarios (coverage > 80%)
- [ ] Tests de integracion para API route
- [ ] Tests E2E con Playwright (5 scenarios)
- [ ] Rate limiting implementado y testeado
- [ ] Code review aprobado
- [ ] Deployed to staging
- [ ] QA testing passed

---

## Testing Strategy

**Test Cases Expected:** 7+ test cases

1. TC-001: Login exitoso con credenciales validas
2. TC-002: Login con contrasena incorrecta
3. TC-003: Login con email no registrado
4. TC-004: Rate limiting despues de 5 intentos
5. TC-005: Tokens almacenados en cookies HTTP-only
6. TC-006: Redirect a returnUrl despues de login
7. TC-007: Validacion de campos vacios

---

## Notes

- Usar el mismo mensaje de error para email invalido y contrasena incorrecta
- Considerar implementar "Remember me" en post-MVP
- El refresh token permite renovar sesion sin re-login

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-002)
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

_Document created: 2025-01-24_
