# Recuperacion de Contrasena

**Jira Key:** FIN-5
**Epic:** FIN-1 (Autenticacion y Gestion de Usuario)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario que olvido mi contrasena
**I want to** recuperar mi contrasena via email
**So that** pueda volver a acceder a mi cuenta

---

## Description

Implementar el flujo completo de recuperacion de contrasena:

1. Solicitud de reset (ingresar email)
2. Envio de email con token temporal (valido 1 hora)
3. Formulario para establecer nueva contrasena
4. Confirmacion y redirect a login

El sistema debe ser seguro y no revelar si un email esta registrado o no.

---

## Acceptance Criteria (Gherkin format)

### Scenario 1: Solicitar email de recuperacion (Happy Path)

```gherkin
Given estoy en la pagina de login
When hago clic en "Olvidaste tu contrasena?"
Then debo ver el formulario de recuperacion
When ingreso mi email registrado "user@example.com"
And hago clic en "Enviar"
Then debo ver el mensaje "Si el email existe, recibiras instrucciones"
And un email de recuperacion debe ser enviado a "user@example.com"
And el email debe contener un link con token valido por 1 hora
```

### Scenario 2: Solicitar recuperacion con email no registrado (Security)

```gherkin
Given estoy en el formulario de recuperacion
When ingreso un email no registrado "nonexistent@example.com"
And hago clic en "Enviar"
Then debo ver el mismo mensaje "Si el email existe, recibiras instrucciones"
And no debe enviarse ningun email
And no debe revelarse que el email no existe
```

### Scenario 3: Resetear contrasena con token valido (Happy Path)

```gherkin
Given recibi un email de recuperacion
And el email contiene un link con token valido
When hago clic en el link dentro de 1 hora
Then debo ver el formulario de nueva contrasena
When ingreso una nueva contrasena "NewSecurePass456" de 8+ caracteres
And confirmo la contrasena
And hago clic en "Cambiar contrasena"
Then mi contrasena debe ser actualizada
And debo ver el mensaje "Contrasena actualizada exitosamente"
And debo ser redirigido a la pagina de login
And debo poder iniciar sesion con la nueva contrasena
```

### Scenario 4: Token de recuperacion expirado (Error Case)

```gherkin
Given tengo un link de recuperacion de mas de 1 hora
When intento usar el link expirado
Then debo ver el mensaje "Este enlace ha expirado"
And debo ver un boton para solicitar un nuevo enlace
And no debo poder cambiar la contrasena
```

### Scenario 5: Rate limiting en solicitudes de recuperacion (Security)

```gherkin
Given he solicitado recuperacion de contrasena 3 veces en la ultima hora
When intento solicitar recuperacion nuevamente
Then debo ver el mensaje "Demasiadas solicitudes. Intenta mas tarde"
And la solicitud no debe procesarse
```

### Scenario 6: Nueva contrasena no cumple requisitos

```gherkin
Given estoy en el formulario de nueva contrasena
When ingreso una contrasena con menos de 8 caracteres
Then debo ver el error "La contrasena debe tener al menos 8 caracteres"
And el boton de cambiar contrasena debe estar deshabilitado
```

---

## Technical Notes

### Frontend

**Componentes:**

- `ForgotPasswordForm.tsx` - Formulario de solicitud
- `ResetPasswordForm.tsx` - Formulario de nueva contrasena

**Paginas:**

- `/forgot-password` - Solicitar recuperacion
- `/reset-password?token=xxx` - Establecer nueva contrasena

**data-testid:**

- `forgot-password-form` - Formulario de solicitud
- `forgot-password-email` - Input de email
- `forgot-password-submit` - Boton de enviar
- `forgot-password-success` - Mensaje de exito
- `reset-password-form` - Formulario de reset
- `reset-password-new` - Input de nueva contrasena
- `reset-password-confirm` - Input de confirmacion
- `reset-password-submit` - Boton de cambiar

### Backend

**API Routes:**

- `POST /api/auth/forgot-password` - Solicitar email de recuperacion
- `POST /api/auth/reset-password` - Establecer nueva contrasena

**Supabase:**

- `supabase.auth.resetPasswordForEmail()` - Enviar email
- Token manejado automaticamente por Supabase

**Request (forgot-password):**

```json
{
  "email": "user@example.com"
}
```

**Response (forgot-password - 200):**

```json
{
  "success": true,
  "data": {
    "message": "Si el email existe, recibiras instrucciones"
  }
}
```

**Request (reset-password):**

```json
{
  "password": "NewSecurePass456"
}
```

### Security

- Rate limit: 3 solicitudes / 1 hora por email
- Token valido por 1 hora
- Mensaje generico para no revelar emails existentes
- HTTPS obligatorio
- Token de uso unico (invalidado despues de usar)

---

## Dependencies

### Blocked By

- FIN-2: User Registration (necesita usuarios registrados)
- Supabase Email service configurado

### Blocks

- Ninguna

### Related Stories

- FIN-3: User Login (destino despues de reset)

---

## UI/UX Considerations

- Mensaje claro y tranquilizador en pantalla de solicitud
- Indicar que revise carpeta de spam
- Loading state durante envio
- Mostrar requisitos de contrasena en formulario de reset
- Confirmacion visual de exito antes de redirect

### Email Template

- Asunto: "Recupera tu contrasena de Finora"
- Contenido claro con link prominente
- Advertencia de que el link expira en 1 hora
- Nota de seguridad si no solicito el reset

---

## Definition of Done

- [ ] Flujo completo de forgot-password implementado
- [ ] Flujo completo de reset-password implementado
- [ ] Email de recuperacion funcional
- [ ] Rate limiting implementado
- [ ] Tests E2E (6 scenarios)
- [ ] Code review aprobado
- [ ] Deployed to staging
- [ ] QA testing passed

---

## Testing Strategy

**Test Cases Expected:** 8+ test cases

1. TC-001: Solicitar recuperacion con email valido
2. TC-002: Solicitar recuperacion con email no registrado
3. TC-003: Reset exitoso con token valido
4. TC-004: Reset con token expirado
5. TC-005: Reset con contrasena debil
6. TC-006: Rate limiting despues de 3 solicitudes
7. TC-007: Token de uso unico
8. TC-008: Redirect a login post-reset

---

## Notes

- Supabase maneja el envio de emails y tokens automaticamente
- Personalizar template de email en Supabase Dashboard
- Considerar agregar CAPTCHA si hay abuse (post-MVP)

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-004)

---

_Document created: 2025-01-24_
