# Autenticacion y Gestion de Usuario

**Jira Key:** FIN-1
**Status:** To Do
**Priority:** P0 (CRITICAL)
**Phase:** Foundation (Sprint 1)
**Estimated Points:** 11

---

## Epic Description

Permitir a los usuarios registrarse, iniciar sesion y gestionar su cuenta de forma segura. Esta epica es fundamental ya que todas las demas funcionalidades dependen de tener un sistema de autenticacion funcional.

**Business Value:**

Sin autenticacion no hay usuarios. Esta epica habilita:

- Registro seguro con email/password
- Login con JWT tokens (access 1hr, refresh 7 dias)
- Recuperacion de contrasena via email
- Personalizacion de perfil (nombre, moneda preferida)

Esta epica es bloqueante para todas las demas funcionalidades del sistema.

---

## User Stories

| #   | Jira Key  | Summary                                    | Points | Priority | FR Ref |
| --- | --------- | ------------------------------------------ | ------ | -------- | ------ |
| 1.1 | **FIN-2** | Registro de usuario con email y contrasena | 3      | High     | FR-001 |
| 1.2 | **FIN-3** | Inicio de sesion con credenciales          | 2      | High     | FR-002 |
| 1.3 | **FIN-4** | Cierre de sesion                           | 1      | High     | FR-003 |
| 1.4 | **FIN-5** | Recuperacion de contrasena                 | 3      | Medium   | FR-004 |
| 1.5 | **FIN-6** | Edicion de perfil de usuario               | 2      | Medium   | FR-005 |

---

## Scope

### In Scope

- Registro con email y contrasena (validacion RFC 5321, password 8+ chars)
- Login con JWT tokens (access token 1hr, refresh token 7 dias)
- Logout con invalidacion de sesion
- Recuperacion de contrasena via email (token valido 1 hora)
- Edicion de perfil (nombre, simbolo de moneda)
- Rate limiting (login 5/15min, register 3/hr, recovery 3/hr)

### Out of Scope (Future)

- Login social (Google, Facebook, Apple)
- Autenticacion de dos factores (2FA)
- Verificacion de email obligatoria
- Cambio de email
- Eliminacion de cuenta

---

## Acceptance Criteria (Epic Level)

1. Usuario puede registrarse con email valido (RFC 5321) y password de 8+ caracteres
2. Usuario puede iniciar sesion y recibir JWT tokens (access + refresh)
3. Usuario puede cerrar sesion y su token es invalidado
4. Usuario puede solicitar recuperacion de contrasena y recibir email
5. Usuario puede establecer nueva contrasena con token valido (1 hora)
6. Usuario puede editar su nombre y simbolo de moneda preferida
7. Sistema aplica rate limiting en endpoints sensibles

---

## Related Functional Requirements

- **FR-001:** User Registration - Registro con email/password, validacion RFC 5321
- **FR-002:** User Login - Autenticacion JWT, tokens access/refresh
- **FR-003:** User Logout - Invalidacion de sesion, limpieza de cookies
- **FR-004:** Password Recovery - Solicitud de reset, token temporal, nueva contrasena
- **FR-005:** Profile Management - Edicion de nombre y currency_symbol

See: `.context/SRS/functional-specs.md`

---

## Technical Considerations

### Authentication Provider

- **Supabase Auth** para gestion de usuarios
- JWT tokens manejados por Supabase
- HTTP-only cookies para almacenamiento seguro de tokens

### Database Schema

**Tables:**

- `auth.users` - Tabla de Supabase Auth (managed)
- `public.profiles` - Perfil de usuario extendido
  - `id` (uuid, PK)
  - `user_id` (uuid, FK -> auth.users)
  - `name` (varchar 100, nullable)
  - `currency_symbol` (varchar 10, default '$')
  - `created_at`, `updated_at`

### Security Requirements

- Password hashing: bcrypt (cost factor 10)
- JWT validation en cada API route
- Row Level Security (RLS) en tabla profiles
- Rate limiting por IP y email
- HTTPS obligatorio (TLS 1.3)
- Mensajes de error genericos para evitar enumeracion

---

## Dependencies

### External Dependencies

- Supabase Auth service
- Supabase Email service (para recuperacion de contrasena)

### Internal Dependencies

- Ninguna (esta epica es la base)

### Blocks

- EPIC-FIN-002: Transaction Management
- EPIC-FIN-003: Debt Control
- EPIC-FIN-004: Savings Goals
- EPIC-FIN-005: Subscription Management
- EPIC-FIN-006: Dashboard & Reports

---

## Success Metrics

### Functional Metrics

- 100% de tests E2E passing
- Coverage > 80% en codigo de auth
- Zero vulnerabilidades criticas (OWASP Top 10)

### Business Metrics

- Registration completion rate > 90%
- Login success rate > 98%
- Password recovery completion rate > 70%

---

## Risks & Mitigations

| Risk                   | Impact | Probability | Mitigation                                        |
| ---------------------- | ------ | ----------- | ------------------------------------------------- |
| Supabase Auth downtime | High   | Low         | Implementar retry logic, mostrar mensaje amigable |
| Email delivery delays  | Medium | Medium      | Mostrar mensaje claro de espera, permitir reenvio |
| Brute force attacks    | High   | Medium      | Rate limiting estricto, CAPTCHA si necesario      |
| Token theft            | High   | Low         | HTTP-only cookies, short access token TTL         |

---

## Testing Strategy

See: `.context/PBI/epics/EPIC-FIN-1-user-authentication/feature-test-plan.md` (se crea en Fase 5)

### Test Coverage Requirements

- **Unit Tests:** Validaciones de Zod schemas, utilidades de auth
- **Integration Tests:** API routes contra Supabase (mocked)
- **E2E Tests:** Flujos completos de registro, login, logout, recovery, profile

### Critical Test Scenarios

1. Registro exitoso con datos validos
2. Registro con email duplicado
3. Login exitoso
4. Login con credenciales incorrectas
5. Rate limiting despues de 5 intentos fallidos
6. Logout y sesion invalidada
7. Recuperacion de contrasena completa
8. Token de recuperacion expirado
9. Edicion de perfil exitosa

---

## Implementation Plan

See: `.context/PBI/epics/EPIC-FIN-1-user-authentication/feature-implementation-plan.md` (se crea en Fase 6)

### Recommended Story Order

1. **FIN-2** - User Registration - Foundation (crea usuarios y perfiles)
2. **FIN-3** - User Login - Core logic (permite acceso)
3. **FIN-4** - User Logout - Session management
4. **FIN-6** - Edit Profile - Completa el ciclo de perfil
5. **FIN-5** - Password Recovery - Feature independiente

### Estimated Effort

- **Development:** 1 sprint (2 weeks)
- **Testing:** 0.5 sprint (1 week)
- **Total:** 1.5 sprints

---

## Notes

- La autenticacion usa Supabase Auth para simplificar el MVP
- El email verification es opcional en MVP (puede activarse post-launch)
- Los tokens se almacenan en HTTP-only cookies para mayor seguridad
- El rate limiting es crucial para prevenir ataques de fuerza bruta

---

## Related Documentation

- **PRD:** `.context/PRD/executive-summary.md`, `.context/PRD/mvp-scope.md`
- **SRS:** `.context/SRS/functional-specs.md` (FR-001 to FR-005)
- **Architecture:** `.context/SRS/architecture-specs.md`
- **API Contracts:** `.context/SRS/api-contracts.yaml`
- **User Journeys:** `.context/PRD/user-journeys.md`

---

_Document created: 2025-01-24_
_Last updated: 2025-01-24_
