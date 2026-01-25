# Registro de Usuario con Email y Contrasena

**Jira Key:** FIN-2
**Epic:** FIN-1 (Autenticacion y Gestion de Usuario)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario nuevo
**I want to** registrarme con mi email y contrasena
**So that** pueda crear mi cuenta en Finora y comenzar a gestionar mis finanzas

---

## Description

Implementar el flujo de registro de usuarios con validacion de email (RFC 5321) y contrasena segura (minimo 8 caracteres). El sistema debe crear el usuario en Supabase Auth y generar un perfil inicial en la tabla profiles.

El registro debe ser rapido y sin fricciones, permitiendo al usuario comenzar a usar la aplicacion inmediatamente despues de registrarse.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Registro exitoso con datos validos (Happy Path)

```gherkin
Given estoy en la pagina de registro
When ingreso un email valido "user@example.com"
And ingreso una contrasena de 8 o mas caracteres "SecurePass123"
And hago clic en "Registrarme"
Then mi cuenta debe ser creada en Supabase Auth
And un perfil debe ser creado en la tabla profiles
And debo ver el mensaje "Cuenta creada exitosamente"
And debo ser redirigido al dashboard
And debo estar autenticado con un JWT token valido
```

### Scenario 2: Registro con email ya existente (Error Case)

```gherkin
Given el email "existing@example.com" ya esta registrado en el sistema
When estoy en la pagina de registro
And ingreso el email "existing@example.com"
And ingreso una contrasena valida
And hago clic en "Registrarme"
Then debo ver el error "Este email ya esta registrado"
And debo ver un enlace para iniciar sesion
And no debe crearse una cuenta duplicada
```

### Scenario 3: Registro con contrasena debil (Validation Error)

```gherkin
Given estoy en la pagina de registro
When ingreso un email valido "user@example.com"
And ingreso una contrasena con menos de 8 caracteres "weak"
And hago clic en "Registrarme"
Then debo ver el error "La contrasena debe tener al menos 8 caracteres"
And el boton de registro debe permanecer deshabilitado mientras la contrasena sea invalida
And el registro no debe proceder
```

### Scenario 4: Registro con formato de email invalido (Validation Error)

```gherkin
Given estoy en la pagina de registro
When ingreso un email con formato invalido "notanemail"
And ingreso una contrasena valida
And intento hacer clic en "Registrarme"
Then debo ver el error "El formato de email es invalido"
And el boton de registro debe estar deshabilitado
```

### Scenario 5: Rate limiting en registro (Security)

```gherkin
Given he intentado registrarme 3 veces en la ultima hora desde mi IP
When intento registrarme nuevamente
Then debo ver el mensaje "Demasiados intentos. Intenta de nuevo mas tarde"
And el registro no debe proceder
```

---

## Technical Notes

### Frontend

- **Componente:** `RegisterForm.tsx` en `/src/components/auth/`
- **Pagina:** `/register` (App Router: `src/app/(auth)/register/page.tsx`)
- **Validacion:** Zod schema para email y password
- **Estado:** React Hook Form para manejo de formulario
- **UI Components:** Shadcn/ui Input, Button, Form

**data-testid:**

- `register-form` - Formulario completo
- `register-email` - Input de email
- `register-password` - Input de password
- `register-submit` - Boton de submit
- `register-error` - Mensaje de error
- `register-success` - Mensaje de exito
- `register-login-link` - Link a login

### Backend

- **API Route:** `POST /api/auth/register`
- **Supabase:** `supabase.auth.signUp()`
- **Perfil:** Crear registro en `profiles` table via trigger o API

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response Success (201):**

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
      "refresh_token": "jwt..."
    }
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Este email ya esta registrado"
  }
}
```

### Database

- **Tabla:** `auth.users` (Supabase managed)
- **Tabla:** `public.profiles`
  - Trigger `on_auth_user_created` para crear perfil automaticamente
  - O crear via API despues de signup exitoso

### Validations

| Field    | Rules                                    |
| -------- | ---------------------------------------- |
| email    | Required, RFC 5321 format, max 255 chars |
| password | Required, min 8 chars, max 128 chars     |

---

## Dependencies

### Blocked By

- Ninguna (primera story de la epica)

### Blocks

- FIN-3: User Login (necesita usuarios registrados)
- FIN-5: Password Recovery (necesita usuarios)
- FIN-6: Edit Profile (necesita usuarios)

### Related Stories

- FIN-3: User Login (flujo complementario)

---

## UI/UX Considerations

- Formulario centrado, minimalista
- Validacion en tiempo real (debounce 300ms)
- Mostrar requisitos de contrasena mientras escribe
- Password visibility toggle (ojo)
- Link a login para usuarios existentes
- Loading state en boton durante submit
- Redirect automatico al dashboard post-registro

### Mobile Considerations

- Input types: `email` y `password` para teclados apropiados
- Touch targets minimo 44x44px
- Formulario responsive (max-width: 400px)

---

## Definition of Done

- [ ] Codigo implementado y funcionando
- [ ] Tests unitarios para validaciones (coverage > 80%)
- [ ] Tests de integracion para API route
- [ ] Tests E2E con Playwright (5 scenarios)
- [ ] Code review aprobado (2 reviewers)
- [ ] Documentacion actualizada
- [ ] Deployed to staging
- [ ] QA testing passed
- [ ] Acceptance criteria validated
- [ ] No critical/high bugs open

---

## Testing Strategy

See: `./test-cases.md` (se crea en Fase 5)

**Test Cases Expected:** 8+ detailed test cases covering:

1. TC-001: Registro exitoso con datos validos
2. TC-002: Registro con email duplicado
3. TC-003: Registro con contrasena menor a 8 caracteres
4. TC-004: Registro con email invalido
5. TC-005: Registro con campos vacios
6. TC-006: Rate limiting despues de 3 intentos
7. TC-007: Creacion automatica de perfil
8. TC-008: Tokens JWT generados correctamente

---

## Implementation Plan

See: `./implementation-plan.md` (se crea en Fase 6)

**Implementation Steps Expected:**

1. Crear Zod schema de validacion
2. Crear componente RegisterForm
3. Crear API route POST /api/auth/register
4. Configurar Supabase Auth
5. Crear trigger para perfil automatico
6. Implementar rate limiting
7. Agregar tests unitarios y E2E
8. Code review y deploy

---

## Notes

- El email verification es opcional en MVP (puede activarse despues)
- Considerar agregar CAPTCHA si hay abuse (post-MVP)
- El perfil se crea con currency_symbol = '$' por defecto
- El nombre del usuario queda null hasta que lo edite en perfil

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **PRD:** `.context/PRD/user-journeys.md` (Journey 1: Registration)
- **SRS:** `.context/SRS/functional-specs.md` (FR-001)
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

_Document created: 2025-01-24_
