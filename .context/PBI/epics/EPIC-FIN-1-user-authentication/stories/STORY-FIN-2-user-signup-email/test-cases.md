# Test Cases: FIN-2 - Registro de Usuario con Email y Contrasena

**Fecha:** 2026-02-24
**QA Engineer:** AI-Generated (Shift-Left Analysis)
**Story Jira Key:** FIN-2
**Epic:** FIN-1 - Autenticacion y Gestion de Usuario
**Status:** Draft

---

## Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Valentina (26, Joven Profesional) - Primer contacto con Finora. Registro frustrante = abandono permanente. Pain point: "las apps son complicadas". Registro debe funcionar en menos de 2 minutos desde landing.
- **Secondary:** Carmen (38, Simplificadora) - "Si tengo que ver un tutorial de YouTube para entender la app, ya la perdi."

**Business Value:**

- **Value Proposition:** Habilita "simplicidad radical" - registro en segundos, sin conexion bancaria
- **Business Impact:** KPI directo: Registration completion rate mayor al 90%. Sin registro no hay MAU (500 target), Activation Rate (40%), ni Conversion to Premium (5%). Esta story es la PUERTA DE ENTRADA del negocio.

**Related User Journey:**

- Journey: Journey 1 - Registro y Primer Gasto (Valentina)
- Step: Steps 1-3 (Landing -> Register Form -> Account Created -> Dashboard redirect)

---

### Technical Context of This Story

**Frontend:**

- Components: `RegisterForm.tsx` en `/src/components/auth/`
- Pages/Routes: `/register` (`src/app/(auth)/register/page.tsx`)
- State Management: React Hook Form + Zod (validation), HTTP-only cookies (session)

**Backend:**

- API Endpoints: `POST /api/auth/register`
- Services: Supabase Auth (`supabase.auth.signUp()`)
- Database: `auth.users` (Supabase managed), `public.profiles` (via trigger o API - ambiguedad critica)

**External Services:**

- Supabase Auth (autenticacion, JWT generation)
- Supabase Email Service (verificacion - opcional en MVP)

**Integration Points:**

1. Frontend (RegisterForm) -> API Route (`POST /api/auth/register`)
2. API Route -> Supabase Auth (`signUp()`)
3. Supabase Auth -> `auth.users` (creacion)
4. Trigger/API -> `public.profiles` (creacion de perfil)
5. API Route -> Frontend (JWT tokens -> HTTP-only cookies)
6. Frontend -> Dashboard (redirect post-registro)

---

### Story Complexity Analysis

**Overall Complexity:** High

**Complexity Factors:**

- Business logic complexity: Medium - Validacion RFC 5321 + min 8 chars + external service call
- Integration complexity: High - 6 integration points, trigger vs API ambiguity, JWT cookie management
- Data validation complexity: Medium - Zod en frontend Y backend, RFC 5321 tiene edge cases complejos
- UI complexity: Medium - Real-time validation (debounce 300ms), password toggle, multiples estados

**Estimated Test Effort:** High
**Rationale:** Entry point del sistema con multiples validation layers, integracion critica con profiles, seguridad (rate limiting, HTTP-only cookies). Impacto de negocio critico.

---

### Epic-Level Context (From Feature Test Plan in Jira FIN-1)

**Critical Risks Already Identified at Epic Level:**

- Risk 1: Sincronizacion auth.users -> public.profiles (High/Medium)
  - **Relevance to This Story:** El riesgo mas critico de FIN-2. Si el trigger/API de creacion de perfil falla silenciosamente, el usuario queda con cuenta en auth.users pero sin perfil. La app asume que todo usuario tiene perfil -> errores en runtime de toda la app.
- Risk 2: Supabase Auth como SPOF (High/Low)
  - **Relevance to This Story:** Si Supabase Auth esta caido durante el registro, el usuario no puede crear cuenta. Sistema debe mostrar mensaje amigable y opcion de retry (NFR: 3 intentos con exponential backoff).

**Integration Points from Epic Analysis:**

- Frontend-API Routes: Applies YES - RegisterForm -> POST /api/auth/register
- API Routes-Supabase Auth: Applies YES - supabase.auth.signUp() es la operacion central
- Auth-Profiles (trigger/API): Applies YES - Ambiguedad critica de esta story
- JWT Middleware-HTTP-only Cookies: Applies YES - tokens del registro en cookies

**Critical Questions Already Asked at Epic Level:**

- **For Dev:** Perfil via trigger `on_auth_user_created` o API call explicita post-signUp?
  - **Status:** PENDING
  - **Impact on This Story:** Define el approach de TC-002. Si es trigger: verificar que no falla silenciosamente. Si es API: test de atomicidad.

**Test Strategy from Epic:**

- Test Levels: Unit (mayor 80% Zod schemas), Integration, E2E, API
- Tools: Playwright (E2E), Vitest (Unit), Postman/Newman (API)
- FIN-2 usa los 4 niveles. 18 TCs estimados en epic test plan.

**Summary: How This Story Fits in Epic:**

- **Story Role in Epic:** Primera y mas critica del epic. Crea la base de usuarios. Implementa los integration points mas complejos (Auth + Profiles).
- **Inherited Risks:** Ambos riesgos criticos del epic aplican directamente.
- **Unique Considerations:** Unica story que NO requiere autenticacion previa. Rate limit aqui es 3/hr (mas estricto que login 5/15min).

---

## Paso 2: Story Quality Analysis

### Ambiguities Identified

**Ambiguity 1:** Valores por defecto del perfil en `public.profiles`

- **Location in Story:** AC Scenario 1 - "un perfil debe ser creado en la tabla profiles"
- **Question for Dev:** Valores exactos? `currency_symbol='$'` y `name=null`?
- **Impact on Testing:** Sin esto, no podemos escribir assertions de DB verificables.
- **Suggested Clarification:** Agregar al AC: "Y el perfil debe crearse con currency_symbol='$' y name=null"

**Ambiguity 2:** Almacenamiento de JWT tokens

- **Location in Story:** AC Scenario 1 - "debo estar autenticado con un JWT token valido"
- **Question for Dev:** Confirmado HTTP-only cookies? (architecture-specs lo indica, AC no lo dice)
- **Suggested Clarification:** Agregar al AC: "Y los JWT tokens deben almacenarse en HTTP-only cookies (no localStorage)"

---

### Missing Information / Gaps

**Gap 1:** Sin AC para fallo de creacion de perfil post-signup

- **Type:** Business Rule / Error Scenario
- **Why It's Critical:** Si auth.users se crea pero public.profiles no, estado inconsistente. La app asume que todo usuario tiene perfil -> errores en runtime.
- **Suggested Addition:** "Si la creacion del perfil falla post-signUp, retornar error 500"
- **Impact if Not Added:** Estado inconsistente en DB dificil de debuggear en produccion.

**Gap 2:** Sin AC para error de red durante el submit

- **Type:** Error Scenario / UX
- **Why It's Critical:** Journey 1 identifica este escenario explicitamente como pain point.
- **Suggested Addition:** "Si hay error de red, mostrar 'No pudimos procesar tu solicitud. Intenta de nuevo' con boton retry"
- **Impact if Not Added:** UX degrada en red inestable. Valentina puede pensar que "la app no funciona".

---

### Edge Cases NOT Covered in Original Story

**Edge Case 1:** Email con SQL injection

- **Scenario:** Usuario ingresa `admin'--@test.com`
- **Expected Behavior:** Zod schema rechaza ANTES del API call
- **Criticality:** High
- **Action Required:** Add to test cases

**Edge Case 2:** Perfil con valores por defecto exactos

- **Scenario:** Post-registro, verificar DB state en public.profiles
- **Criticality:** Critical
- **Action Required:** Add to AC + test cases

**Edge Case 3:** Email con espacios al inicio o final

- **Scenario:** Usuario escribe " user@example.com" (espacio inicial)
- **Criticality:** Medium
- **Action Required:** Ask PO - trim automatico o rechazar?

**Edge Case 4:** Profile creation failure

- **Scenario:** auth.users se crea pero public.profiles falla
- **Criticality:** High
- **Action Required:** Ask Dev - cual es el comportamiento esperado?

---

### Testability Validation

**Is this story testeable as written?** Partially

**Testability Issues:**

- Expected results not specific enough (AC Scenario 1: "perfil creado" sin valores exactos)
- Missing error scenarios (error de red, profile creation failure)
- Missing test data examples para validacion de email (RFC 5321 edge cases)

**Recommendations:**

1. Agregar valores exactos del perfil al AC Scenario 1
2. Agregar AC para error de red durante submit
3. Definir explicitamente storage de tokens en AC

---

## Paso 3: Refined Acceptance Criteria

### Scenario 1: Registro exitoso con datos validos (Refined)

**Type:** Positive
**Priority:** Critical

- **Given:**
  - El usuario esta en `/register`
  - NO existe usuario con `test@finora.app` en `auth.users`

- **When:**
  - Ingresa email: `test@finora.app`
  - Ingresa password: `SecurePass123`
  - Click en "Registrarme"

- **Then:**
  - Registro creado en `auth.users`
  - Perfil creado en `public.profiles` con `currency_symbol='$'` y `name=null`
  - `[data-testid="register-success"]` = "Cuenta creada exitosamente"
  - Redirect a `/dashboard`
  - JWT tokens en HTTP-only cookies (NO localStorage)
  - API: `201 Created` con `{ success: true, data: { user: { id, email }, session: { access_token, refresh_token } } }`

---

### Scenario 2: Email ya existente (Refined)

**Type:** Negative
**Priority:** High

- **Given:** `existing@finora.app` existe en `auth.users`
- **When:** Intento registrarme con ese email
- **Then:**
  - `[data-testid="register-error"]` = "Este email ya esta registrado"
  - `[data-testid="register-login-link"]` visible
  - NO hay redirect, NO hay duplicado en DB
  - API: `400 { success: false, error: { code: "EMAIL_EXISTS" } }`

---

### Scenario 3: Contrasena debil (Refined)

**Type:** Negative
**Priority:** High

- **When:** Ingresa password "weak" (menos de 8 chars)
- **Then:**
  - `[data-testid="register-error"]` = "La contrasena debe tener al menos 8 caracteres"
  - `[data-testid="register-submit"]` deshabilitado
  - Validacion en tiempo real (debounce 300ms)
  - CERO calls a `POST /api/auth/register`

---

### Scenario 4: Email invalido (Refined)

**Type:** Negative
**Priority:** High

- **When:** Ingresa email "notanemail"
- **Then:**
  - `[data-testid="register-error"]` = "El formato de email es invalido"
  - `[data-testid="register-submit"]` deshabilitado
  - CERO calls a la API

---

### Scenario 5: Rate limiting - 4to intento (Refined)

**Type:** Security
**Priority:** High

- **Given:** IP ha intentado 3 veces en la ultima hora
- **When:** 4to intento
- **Then:** "Demasiados intentos. Intenta de nuevo mas tarde", API: `429 Too Many Requests`

---

### Scenario 6: Perfil con valores por defecto [NUEVO - gap identificado]

**Type:** Integration
**Priority:** Critical
**Source:** Gap no cubierto en AC original

- **When:** Registro exitoso
- **Then:**
  - `public.profiles`: `user_id` del nuevo usuario, `currency_symbol='$'`, `name=null`, timestamps validos
  - NOTE: Necesita confirmacion Dev sobre mecanismo (trigger vs API)

---

### Scenario 7: Password exactamente 8 caracteres (Boundary)

**Type:** Boundary
**Priority:** Medium

- **When:** Ingresa password "pass1234" (8 chars exactos)
- **Then:** Validacion acepta, submit habilitado, registro puede proceder

---

### Scenario 8: SQL injection en email [NUEVO - edge case seguridad]

**Type:** Security
**Priority:** High
**Source:** Edge case no cubierto en AC original

- **When:** Ingresa email "admin'--@test.com"
- **Then:**
  - Zod rechaza ANTES del API call
  - `[data-testid="register-error"]` = "El formato de email es invalido"
  - CERO calls a `POST /api/auth/register`

---

## Paso 4: Test Design

### Test Coverage Analysis

**Total Test Cases Needed:** 18

**Breakdown:**

- Positive: 3 (registro exitoso, perfil con defaults, tokens validos)
- Negative: 5 (email duplicado, password corto, email invalido, campos vacios, email mayor 254 chars)
- Boundary: 3 (password = 8 chars, password = 128 chars, email = 254 chars)
- Integration: 4 (Supabase Auth call, profiles creation, HTTP-only cookies, dashboard redirect)
- API: 3 (201 success, 400 EMAIL_EXISTS, 429 rate limit)

**Rationale:** Alta complejidad por ser el entry point con multiples validation layers, integracion critica con profiles, y requisitos de seguridad.

---

### Parametrization Opportunities

**Parametrized Tests Recommended:** Yes

**Parametrized Test Group 1:** Invalid Email Formats (RFC 5321 edge cases)

- **Base Scenario:** Registro rechazado con email invalido

| Email Input         | Expected Error         | API Called? |
| ------------------- | ---------------------- | ----------- |
| `notanemail`        | Error formato invalido | No          |
| `@nodomain.com`     | Error formato invalido | No          |
| `user@`             | Error formato invalido | No          |
| `user @example.com` | Error formato invalido | No          |
| `user@exam ple.com` | Error formato invalido | No          |
| `admin'--@test.com` | Error formato invalido | No          |
| (vacio)             | Submit deshabilitado   | No          |

**Total Tests from Parametrization:** 7 -> 1 test parametrizado
**Benefit:** Cubre RFC 5321 exhaustivamente sin duplicacion.

---

**Parametrized Test Group 2:** Password Validation Boundaries

| Password     | Length | Expected                  |
| ------------ | ------ | ------------------------- |
| (vacio)      | 0      | Submit deshabilitado      |
| `abc`        | 3      | Error: min 8 chars        |
| `1234567`    | 7      | Error: min 8 chars        |
| `pass1234`   | 8      | Accepted (lower boundary) |
| `ValidPass1` | 10     | Accepted                  |
| (128 chars)  | 128    | Accepted (upper boundary) |

---

### Test Outlines

---

#### Should register successfully with valid credentials and redirect to dashboard

**Related Scenario:** Scenario 1
**Type:** Positive
**Priority:** Critical
**Test Level:** E2E (Playwright)
**Parametrized:** No

---

**Preconditions:**

- Email unico `test-{timestamp}@finora.app` NO existe en `auth.users`
- Staging: `https://staging.finora.app`

---

**Test Steps:**

1. Navegar a `https://staging.finora.app/register`
   - **Verify:** `[data-testid="register-form"]` visible
2. Ingresar email en `[data-testid="register-email"]`
   - **Data:** `test-{faker.number.int({min:1000,max:9999})}@finora.app`
3. Ingresar password en `[data-testid="register-password"]`
   - **Data:** `SecurePass123`
4. Click en `[data-testid="register-submit"]`
5. Verify: `[data-testid="register-success"]` = "Cuenta creada exitosamente"
6. Verify: URL actual = `/dashboard`

---

**Expected Result:**

- **UI:** Mensaje de exito + redirect a `/dashboard` + loading state visible durante submit
- **API Response:**
  - Status Code: `201 Created`
  - Response Body:
    ```json
    {
      "success": true,
      "data": {
        "user": { "id": "<uuid>", "email": "test-ts@finora.app" },
        "session": { "access_token": "<jwt>", "refresh_token": "<jwt>" }
      }
    }
    ```
- **Database:**
  - `auth.users`: Nuevo registro con el email
  - `public.profiles`: `user_id` = UUID, `currency_symbol='$'`, `name=null`
- **Security:** Cookies HTTP-only; localStorage NO contiene tokens

---

**Test Data:**

```json
{
  "input": {
    "email": "test-{faker.number.int({min:1000,max:9999})}@finora.app",
    "password": "SecurePass123"
  },
  "expected_profile": { "currency_symbol": "$", "name": null }
}
```

---

**Post-conditions:** `supabase.auth.admin.deleteUser(userId)`

---

#### Should create profile with default values after registration

**Related Scenario:** Scenario 6
**Type:** Integration
**Priority:** Critical
**Test Level:** Integration / API
**Parametrized:** No

---

**Preconditions:**

- Email unico disponible
- Acceso a Supabase DB staging

---

**Test Steps:**

1. `POST /api/auth/register` con email y password validos
2. Extraer `user.id` del response
3. Query: `SELECT * FROM public.profiles WHERE user_id = {user.id}`
4. Verificar campos

---

**Expected Result:**

- **Database `public.profiles`:**
  - `user_id` = UUID del response
  - `currency_symbol` = `'$'`
  - `name` = `null`
  - `created_at` y `updated_at` = timestamps validos
- **Timing:** Perfil debe existir en menos de 2s post-registro

**Post-conditions:** `supabase.auth.admin.deleteUser()`

---

#### Should store JWT tokens in HTTP-only cookies (not localStorage) after registration

**Related Scenario:** Scenario 1 (aspecto seguridad)
**Type:** Security
**Priority:** Critical
**Test Level:** E2E (Playwright)
**Parametrized:** No

---

**Test Steps:**

1. Completar registro exitoso
2. Verify: Cookies con `HttpOnly=true` y `Secure=true`
3. Verify: `localStorage.getItem('supabase.auth.token')` = `null`
4. Verify: `sessionStorage` NO contiene tokens JWT

---

**Expected Result:**

- JWT tokens en HTTP-only cookies
- localStorage y sessionStorage sin tokens
- Cookies con flag Secure activo en staging

---

#### Should reject invalid email formats - RFC 5321 (parametrized)

**Related Scenario:** Scenario 4
**Type:** Negative
**Priority:** High
**Test Level:** UI + API
**Parametrized:** Yes (Group 1)

---

**Test Steps (por cada data set):**

1. Navegar a `/register`
2. Ingresar email del data set en `[data-testid="register-email"]`
3. Ingresar password: `ValidPass123`
4. Verify: `[data-testid="register-error"]` muestra mensaje de error
5. Verify: `[data-testid="register-submit"]` deshabilitado
6. Verify: CERO calls a `POST /api/auth/register`

---

#### Should display error when registering with already registered email

**Related Scenario:** Scenario 2
**Type:** Negative
**Priority:** High
**Test Level:** E2E + API
**Parametrized:** No

---

**Preconditions:** `existing-test@finora.app` existe en `auth.users` (fixture permanente staging)

**Test Steps:**

1. Navegar a `/register`
2. Ingresar `existing-test@finora.app` / `ValidPass123`
3. Click en submit
4. Verify: `[data-testid="register-error"]` = "Este email ya esta registrado"
5. Verify: `[data-testid="register-login-link"]` visible
6. Verify: URL sigue siendo `/register`

**Expected Result:**

- **API:** `400 { success: false, error: { code: "EMAIL_EXISTS" } }`
- **Database:** NO hay duplicados

**Test Data:**

```json
{
  "existing_user": { "email": "existing-test@finora.app" },
  "attempt": { "email": "existing-test@finora.app", "password": "DifferentPass456" }
}
```

---

#### Should reject weak passwords and validate length boundaries (parametrized)

**Related Scenario:** Scenario 3 + boundary
**Type:** Negative + Boundary
**Priority:** High
**Test Level:** UI
**Parametrized:** Yes (Group 2)

---

**Test Steps (por data set):**

1. Ingresar email: `test@finora.app`
2. Ingresar password del data set
3. Verify validacion en tiempo real (debounce 300ms)
4. Verify estado del submit button

---

#### Should return 429 when registration rate limit is exceeded (3/hour)

**Related Scenario:** Scenario 5
**Type:** Security
**Priority:** High
**Test Level:** API
**Parametrized:** No

---

**Test Steps:**

1. Intentos 1-3: `POST /api/auth/register` con distintos emails validos
2. 4to intento: `POST /api/auth/register`
3. Verify: Status `429 Too Many Requests`
4. Verify UI: "Demasiados intentos. Intenta de nuevo mas tarde"

**PREGUNTA para Dev:** El rate limit, cuenta todos los requests o solo los que llegan a Supabase?

---

#### Should accept email with exactly 254 characters (RFC 5321 max boundary)

**Type:** Boundary
**Priority:** Medium
**Test Level:** API

**Test Data:** email de 254 chars totales (240-char-local-part@finora.app)
**Expected Result:** `201 Created`

---

#### Should reject email longer than 254 characters

**Type:** Negative / Boundary
**Priority:** Medium
**Test Level:** UI + API

**Expected Result:** Error validacion en UI + `400 Bad Request` en API

---

#### Should reject SQL injection attempt in email field

**Related Scenario:** Scenario 8
**Type:** Security
**Priority:** High
**Test Level:** UI + API

**Test Data:** `email = "admin'--@test.com"`
**Expected Result:** Zod rechaza ANTES del API call. Error "El formato de email es invalido" en UI.

---

#### Should return 201 with full API contract for successful registration

**Type:** API
**Priority:** Critical
**Test Level:** API (Postman)

**Expected Result:**

- Status: `201 Created`
- Schema match con `api-contracts.yaml`
- Response time menor a 300ms (NFR Auth Operations)

---

#### Should return correct 400 error response for EMAIL_EXISTS

**Type:** API
**Priority:** High
**Test Level:** API (Postman)

**Expected Result:**

```json
{
  "success": false,
  "error": { "code": "EMAIL_EXISTS", "message": "Este email ya esta registrado" }
}
```

---

#### Should accept password with exactly 8 characters (lower boundary)

**Type:** Boundary
**Priority:** Medium
**Test Level:** UI

**Test Data:** `password = "pass1234"` (8 chars)
**Expected Result:** Sin error de longitud, submit habilitado

---

#### Should accept password with 128 characters (upper boundary)

**Type:** Boundary
**Priority:** Medium
**Test Level:** API

**Test Data:** password de 128 caracteres
**Expected Result:** `201 Created`

---

#### Should disable submit button when fields are empty

**Type:** Negative
**Priority:** High
**Test Level:** UI

**Expected Result:** Submit deshabilitado. CERO calls a la API.

---

#### Should reject email longer than 254 characters via API

**Type:** Negative / Boundary
**Priority:** Medium
**Test Level:** API

**Expected Result:** `400 Bad Request` con `VALIDATION_ERROR`

---

#### Should create user record in auth.users after successful registration

**Type:** Integration
**Priority:** Critical
**Test Level:** Integration

**Expected Result:** Registro en `auth.users` con el email exacto. Confirmado via Supabase admin API.

---

#### Should redirect to /dashboard after successful registration

**Type:** Integration
**Priority:** High
**Test Level:** E2E (Playwright)

**Expected Result:** URL = `/dashboard` post 201. TanStack Query carga datos con la sesion.

---

## Integration Test Cases

### Integration Test 1: RegisterForm -> POST /api/auth/register

**Integration Point:** Frontend -> Backend API
**Type:** Integration
**Priority:** High

**Preconditions:**

- Next.js server corriendo
- Supabase staging conectado

**Test Flow:**

1. RegisterForm -> React Hook Form submits
2. TanStack Query mutation -> `POST /api/auth/register`
3. API Route -> Zod server-side validation
4. API Route -> `supabase.auth.signUp()`
5. Response -> HTTP-only cookies + redirect `/dashboard`

**Contract Validation:**

- Request format matches OpenAPI spec: Yes
- Response format matches OpenAPI spec: Yes
- Status codes match spec: Yes

**Expected Result:** Data flows correctamente. HTTP-only cookies seteadas. Redirect a `/dashboard`.

---

### Integration Test 2: Supabase Auth -> public.profiles (Trigger/API)

**Integration Point:** Supabase Auth -> PostgreSQL
**Type:** Integration
**Priority:** Critical

**Mock Strategy:**

- Unit tests: Mockear Supabase client
- Integration/E2E: Usar Supabase staging real

**Test Flow:**

1. `supabase.auth.signUp()` crea registro en `auth.users`
2. Trigger `on_auth_user_created` (o API call) crea registro en `public.profiles`
3. Verificar via Supabase admin que el perfil existe con valores correctos

**Expected Result:**

- `public.profiles` tiene `currency_symbol='$'`, `name=null`
- Si mecanismo falla: sistema retorna error (NO deja estado inconsistente)

---

## Edge Cases Summary

| Edge Case                                | Covered in Original Story? | Added to Refined AC? | Test Case | Priority |
| ---------------------------------------- | -------------------------- | -------------------- | --------- | -------- |
| SQL injection en email                   | No                         | Yes (Scenario 8)     | TC-010    | High     |
| Profile defaults (currency_symbol, name) | Implicito                  | Yes (Scenario 6)     | TC-002    | Critical |
| Email = 254 chars (RFC max)              | No                         | Yes (Boundary)       | TC-008    | Medium   |
| Password = 8 chars exactos               | No                         | Yes (Scenario 7)     | TC-013    | Medium   |
| Password = 128 chars                     | No                         | Yes (Boundary)       | TC-014    | Medium   |
| Email con espacios inicio/final          | No                         | Pending PO           | TBD       | Medium   |
| Profile creation failure                 | No                         | Pending Dev          | TBD       | High     |
| Error de red durante submit              | No                         | Pending PO           | TBD       | Medium   |

---

## Test Data Summary

### Data Categories

| Data Type          | Count | Purpose           | Examples                                   |
| ------------------ | ----- | ----------------- | ------------------------------------------ |
| Valid data         | 4     | Positive tests    | `test-{ts}@finora.app` / `SecurePass123`   |
| Invalid email      | 6     | Negative tests    | `notanemail`, `user@`, SQL injection       |
| Invalid password   | 3     | Negative tests    | `abc`, `1234567`, vacio                    |
| Boundary values    | 4     | Boundary tests    | pass=8chars, pass=128chars, email=254chars |
| Security payloads  | 2     | Security tests    | `admin'--@test.com`                        |
| Fixtures (staging) | 1     | EMAIL_EXISTS test | `existing-test@finora.app`                 |

### Data Generation Strategy

**Static Test Data:**

- `existing-test@finora.app` - fixture permanente en staging
- SQL injection payload: `admin'--@test.com`
- Boundary strings: password de 8 chars (pass1234), 128 chars; email de 254 chars

**Dynamic Test Data (Faker.js):**

- Emails unicos: `test-${faker.number.int({min:1000,max:99999})}@finora.app`
- Timestamps: `Date.now()`

**Test Data Cleanup:**

- Usuarios de prueba eliminados via `supabase.auth.admin.deleteUser()` post-ejecucion
- Tests son idempotentes
- `existing-test@finora.app` es fixture permanente de staging

---

## Definition of Done (QA Perspective)

Esta story se considera "Done" desde QA cuando:

- [ ] Todas las ambiguedades y preguntas son resueltas
- [ ] Story actualizada con mejoras sugeridas (si aceptadas por PO)
- [ ] Los 18 test cases ejecutados y passing
- [ ] Critical/High test cases: 100% passing
- [ ] Medium/Low test cases: mayor igual al 95% passing
- [ ] Todos los bugs criticos y altos resueltos
- [ ] Integration tests passing (profiles creation verificada)
- [ ] API contract validation passed para `POST /api/auth/register`
- [ ] Security tests passing (rate limiting, SQL injection, HTTP-only cookies)
- [ ] NFR validado: Response time menor a 300ms p95
- [ ] Regression tests passed
- [ ] Exploratory testing completado
- [ ] Test execution report generado
- [ ] No blockers para FIN-3, FIN-5, FIN-6

---

## Related Documentation

- **Story:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/stories/STORY-FIN-2-user-signup-email/story.md`
- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **Feature Test Plan:** Jira FIN-1 (comentario "Feature Test Plan - Generated 2026-02-24")
- **Business Model:** `.context/idea/business-model.md`
- **PRD:** `.context/PRD/` (executive-summary, user-personas, user-journeys)
- **SRS:** `.context/SRS/` (functional-specs FR-001, non-functional-specs, architecture-specs)
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

## Test Execution Tracking

[Esta seccion se completa durante ejecucion]

**Test Execution Date:** TBD
**Environment:** Staging (https://staging.finora.app)
**Executed By:** TBD

**Results:**

- Total Tests: 18
- Passed: TBD
- Failed: TBD
- Blocked: TBD

**Bugs Found:** TBD

**Sign-off:** [Nombre QA] - [Fecha]
