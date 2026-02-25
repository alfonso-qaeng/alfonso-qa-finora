# Test Cases: FIN-3 - Inicio de Sesion con Credenciales

**Fecha:** 2026-02-24
**QA Engineer:** AI-Generated (Shift-Left Analysis)
**Story Jira Key:** FIN-3
**Epic:** FIN-1 - Autenticacion y Gestion de Usuario
**Status:** Draft

---

## Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Valentina (26, Joven Profesional) - Login = re-acceso al sistema que ella ya eligio. Login failure rate alto = abandono definitivo. KPI directo: Login success rate > 98%.
- **Secondary:** Andres (32, Freelancer) - Vuelve frecuentemente. Depende del refresh token de 7 dias para no re-loguearse en cada sesion. Un refresh token mal manejado = friccion constante.

**Business Value:**

- **Value Proposition:** Acceso rapido y seguro a las finanzas personales. "Tu Finanzas, Simplificadas" comienza aqui.
- **Business Impact:** KPI Login success rate > 98%. Todas las rutas protegidas del sistema dependen de esta story. Sin login funcional, las epicas FIN-2 a FIN-6 completas son inaccesibles.

**Related User Journey:**

- Journey: Journey 1 - Registro y Primer Gasto (Valentina)
- Step: Fase de retorno post-registro. Usuario ya registrado accede a su cuenta para gestionar finanzas.

---

### Technical Context of This Story

**Frontend:**

- Components: `LoginForm.tsx` en `/src/components/auth/`
- Pages/Routes: `/login` (`src/app/(auth)/login/page.tsx`)
- State Management: React Hook Form + Zod (client validation), HTTP-only cookies (session tokens)

**Backend:**

- API Endpoints: `POST /api/auth/login`
- Services: Supabase Auth (`supabase.auth.signInWithPassword()`)
- Database: `auth.users` (Supabase managed) - solo lectura para validar credenciales

**External Services:**

- Supabase Auth (autenticacion, JWT generation, session management)

**Integration Points:**

1. LoginForm -> POST /api/auth/login
2. API Route -> Supabase Auth (signInWithPassword)
3. Supabase Auth -> JWT generation (access token 1hr + refresh token 7 dias)
4. API Route -> HTTP-only cookies (set tokens en response)
5. Middleware JWT -> Rutas protegidas (validacion en cada request)
6. Frontend -> returnUrl redirect logic (post-login navigation)

---

### Story Complexity Analysis

**Overall Complexity:** High (security critical path)

**Complexity Factors:**

- Business logic complexity: Medium - Validacion de credenciales + JWT handling + redirect logic
- Integration complexity: High - 6 integration points, rate limiting por IP, JWT middleware en todas las rutas
- Security complexity: High - Anti-enumeration, HTTP-only cookies, rate limiting exacto, open redirect protection
- UI complexity: Low-Medium - Formulario simple pero con multiples estados (loading, error, success)

**Estimated Test Effort:** High
**Rationale:** Critico para seguridad. Rate limiting y mensajes genericos son fundamentales contra fuerza bruta y enumeracion de cuentas. 6 integration points, cross-browser testing requerido para HTTP-only cookies.

---

### Epic-Level Context (From Feature Test Plan in Jira FIN-1)

**Critical Risks Already Identified at Epic Level:**

- Risk 3: Rate Limiting - falsos positivos o bypass (Medium/Medium)
  - **Relevance to This Story:** Boundary exacto de rate limit en FIN-3: 5to intento permite fallo normal de auth, 6to es bloqueado por rate limit (429). El contador debe resetearse correctamente despues de la ventana de 15 minutos.
- Risk 4: JWT Token Refresh Flow (High/Low)
  - **Relevance to This Story:** Cuando el access token expira (1hr) con refresh token activo, el sistema debe renovar transparentemente. Esta story crea los tokens iniciales - el comportamiento de renovacion no esta en los AC actuales.

**Integration Points from Epic Analysis:**

- Frontend HTTP-only Cookies: Applies YES - login es donde se setean las cookies inicialmente. Cross-browser (Chrome, Firefox, Safari iOS) critico.
- API Routes - Supabase Auth: Applies YES - signInWithPassword() es la operacion central
- Middleware JWT: Applies YES - tokens creados aqui son validados en TODAS las rutas protegidas

**Critical Questions Already Asked at Epic Level:**

- **Ambiguity 2 (Feature Test Plan):** Refresh token 7 dias como "remember me" de facto en MVP
  - **Status:** PENDING
  - **Impact on This Story:** Define expectativa de sesion del usuario. Si no es "remember me", se necesita AC explicito para duracion de sesion.

- **Improvement 3 (Feature Test Plan):** AC para error de red falta en FIN-2, FIN-3, FIN-5
  - **Status:** PENDING (confirmado como gap a agregar)
  - **Impact on This Story:** Necesitamos Scenario 8 (error de red) en AC y test case correspondiente.

**Test Strategy from Epic:**

- Test Levels: Unit (Zod schemas), Integration, E2E, API
- Tools: Playwright (E2E), Vitest (Unit), Postman/Newman (API)
- FIN-3 usa los 4 niveles. 14 TCs estimados en Feature Test Plan. Este analisis genera 15 (1 extra por open redirect gap).

**Summary: How This Story Fits in Epic:**

- **Story Role in Epic:** Segunda story en orden de implementacion. Depende de FIN-2 (necesita usuarios). Bloquea todas las rutas protegidas y FIN-4/FIN-6.
- **Inherited Risks:** Risk 3 (rate limiting) y Risk 4 (JWT refresh) aplican directamente.
- **Unique Considerations:** Unica story con logica anti-enumeration (mismo mensaje para password incorrecta Y email no registrado). Open redirect en returnUrl es un edge case de seguridad unico de esta story.

---

## Paso 2: Story Quality Analysis

### Ambiguities Identified

**Ambiguity 1:** Mecanismo de almacenamiento de returnUrl

- **Location in Story:** Technical Notes - "Redirect: Guardar returnUrl en query params o sessionStorage"
- **Question for Dev:** Cual de los dos mecanismos se usa? Query params (`/login?returnUrl=/dashboard/goals`) o sessionStorage?
- **Impact on Testing:** Los pasos del test de Scenario 5 cambian completamente. Query params son testeables con URL inspection; sessionStorage requiere acceso al browser storage en el test.
- **Suggested Clarification:** Definir explicitamente: "returnUrl se almacena en query params del URL de redirect"

**Ambiguity 2:** Comportamiento del rate limit counter post-login exitoso

- **Location in Story:** Scenario 4 (rate limiting) - no menciona reset del contador
- **Question for Dev:** Si el usuario falla 4 intentos, luego hace login correcto, el contador vuelve a 0? O se mantiene en 4 y el siguiente fallo seria el 5to?
- **Impact on Testing:** Define si el rate limit puede ser "bypasseado" con una autenticacion exitosa intercalada.
- **Suggested Clarification:** Agregar al AC: "El contador de intentos fallidos se resetea a 0 despues de un login exitoso"

---

### Missing Information / Gaps

**Gap 1:** Sin AC para error de red durante submit

- **Type:** Error Scenario / UX
- **Why It's Critical:** Feature Test Plan Improvement 3 ya lo identifica para FIN-3. Journey 1 contempla este escenario.
- **Suggested Addition:** "Si hay error de red durante el submit, mostrar 'No pudimos procesar tu solicitud. Intenta de nuevo'"
- **Impact if Not Added:** UX degrada en redes inestables. Valentina puede pensar que "la app no funciona".

**Gap 2:** Sin AC para usuario ya autenticado que navega a /login

- **Type:** Business Rule / UX
- **Why It's Critical:** Sin este comportamiento definido, usuarios logueados ven el formulario de login (UX confusa).
- **Suggested Addition:** "Si el usuario tiene sesion activa y navega a /login, debe ser redirigido automaticamente a /dashboard"
- **Impact if Not Added:** UX inconsistente, posible confusion del usuario sobre su estado de sesion.

**Gap 3:** Sin AC para proteccion de Open Redirect en returnUrl

- **Type:** Security
- **Why It's Critical:** Sin validacion, un atacante puede construir `/login?returnUrl=https://evil.com` para phishing post-login.
- **Suggested Addition:** "returnUrl solo acepta URLs relativas internas. URLs externas son rechazadas y el redirect va a /dashboard."
- **Impact if Not Added:** Vulnerabilidad de Open Redirect (OWASP A01).

---

### Edge Cases NOT Covered in Original Story

**Edge Case 1:** Usuario ya autenticado navega a /login

- **Scenario:** Sesion activa + navegacion manual a /login
- **Expected Behavior:** Redirect silencioso a /dashboard
- **Criticality:** Medium
- **Action Required:** Add to AC + test cases

**Edge Case 2:** returnUrl con URL externa (Open Redirect)

- **Scenario:** `/login?returnUrl=https://evil.com` o `?returnUrl=//evil.com`
- **Expected Behavior:** Ignorar returnUrl externa, redirect a /dashboard
- **Criticality:** High
- **Action Required:** Add to AC + test cases (security requirement)

**Edge Case 3:** SQL injection en campo email

- **Scenario:** `admin'--@example.com` en campo email
- **Expected Behavior:** Zod rechaza antes del API call. Error de formato invalido.
- **Criticality:** High
- **Action Required:** Add to test cases

**Edge Case 4:** Access token expirado con refresh token valido

- **Scenario:** 1hr despues del login, usuario hace accion en la app
- **Expected Behavior:** Auto-renovacion transparente del access token via refresh token (NO re-login)
- **Criticality:** High
- **Action Required:** Pregunta a Dev - el middleware maneja esto automaticamente? Agregar test si aplica a esta story.

---

### Testability Validation

**Is this story testeable as written?** Partially

**Testability Issues:**

- returnUrl mechanism no especificado (query params vs sessionStorage) - bloquea escritura exacta de TC-002
- Sin AC para open redirect - gap de seguridad que puede crear vulnerabilidad
- Missing test data: no hay fixture de usuario de login definido para staging

**Recommendations:**

1. Definir mecanismo de returnUrl antes de implementacion
2. Agregar AC de open redirect protection (Scenario 7)
3. Definir fixture de usuario de login para staging: `login-test@finora.app` / `SecurePass123`

---

## Paso 3: Refined Acceptance Criteria

### Scenario 1: Login exitoso con credenciales validas (Refined)

**Type:** Positive
**Priority:** Critical

- **Given:**
  - Usuario existe en `auth.users` con `test-login@finora.app` / `SecurePass123`
  - El usuario NO tiene sesion activa previa
  - Se esta en `/login`

- **When:**
  - Ingresa `test-login@finora.app` en `[data-testid="login-email"]`
  - Ingresa `SecurePass123` en `[data-testid="login-password"]`
  - Click en `[data-testid="login-submit"]`

- **Then:**
  - `[data-testid="login-form"]` no muestra mensaje de error
  - JWT tokens almacenados en HTTP-only cookies (NO localStorage, NO sessionStorage)
  - Access token TTL: 1 hora
  - Refresh token TTL: 7 dias
  - URL actual = `/dashboard`
  - API: `200 OK` con `{ success: true, data: { user: { id, email }, session: { access_token, refresh_token, expires_at } } }`

---

### Scenario 2: Login con contrasena incorrecta (Refined)

**Type:** Negative
**Priority:** High

- **Given:** `test-login@finora.app` existe en `auth.users`
- **When:** Ingresa email correcto + password incorrecto `WrongPass999` + click submit
- **Then:**
  - `[data-testid="login-error"]` = "Email o contrasena incorrectos"
  - NO tokens generados, NO cookies seteadas
  - URL sigue siendo `/login`
  - API: `401 { success: false, error: { code: "INVALID_CREDENTIALS" } }`

---

### Scenario 3: Login con email no registrado (Refined)

**Type:** Negative
**Priority:** High

- **When:** Ingresa `nonexistent@finora.app` (no existe) + cualquier password + click submit
- **Then:**
  - `[data-testid="login-error"]` = "Email o contrasena incorrectos" (MISMO mensaje que Scenario 2 - anti-enumeration)
  - API: `401 { success: false, error: { code: "INVALID_CREDENTIALS" } }` (mismo codigo)
  - NOTE: El mensaje y codigo son identicos a Scenario 2 por diseno de seguridad

---

### Scenario 4: Rate limiting - 6to intento bloqueado (Refined)

**Type:** Security
**Priority:** High

- **Given:** 5 intentos fallidos desde la misma IP en los ultimos 15 minutos
- **When:** 6to intento de login (cualquier credencial)
- **Then:**
  - `[data-testid="login-error"]` = "Demasiados intentos. Intenta de nuevo en X minutos"
  - API: `429 Too Many Requests`
  - El intento NO llega a Supabase Auth (bloqueado en rate limiter)

---

### Scenario 5: Redirect a returnUrl post-login (Refined)

**Type:** Positive
**Priority:** High

- **Given:**
  - Usuario intenta acceder a `/dashboard/goals` sin autenticacion
  - Middleware redirige a `/login` con returnUrl guardada (mecanismo PENDIENTE confirmacion Dev)
- **When:** Completa login exitoso
- **Then:**
  - URL = `/dashboard/goals` (no `/dashboard` generico)
  - NOTE: Mecanismo de returnUrl (query params vs sessionStorage) PENDIENTE de confirmacion Dev

---

### Scenario 6: Usuario ya autenticado navega a /login (NUEVO)

**Type:** Edge Case / UX
**Priority:** Medium
**Source:** Gap no cubierto en story original

- **Given:** Usuario con sesion activa (JWT valido en cookies)
- **When:** Navega manualmente a `/login`
- **Then:**
  - Redirect automatico a `/dashboard` sin mostrar formulario de login
  - NOTE: Behavior PENDIENTE confirmacion PO (redirect silencioso o con aviso?)

---

### Scenario 7: returnUrl externa rechazada - Open Redirect Protection (NUEVO)

**Type:** Security
**Priority:** High
**Source:** Security gap identificado en analisis

- **Given:** URL construida `/login?returnUrl=https://evil.com` o `?returnUrl=//evil.com`
- **When:** Usuario completa login exitoso
- **Then:**
  - Redirect va a `/dashboard` (NO a URL externa)
  - Solo URLs relativas internas son aceptadas como returnUrl valido
  - NOTE: Necesita AC explicito en story y logica de validacion en el middleware de redirect

---

### Scenario 8: Error de red durante submit (NUEVO)

**Type:** Error Scenario
**Priority:** Medium
**Source:** Gap identificado - Feature Test Plan Improvement 3

- **When:** Network request a `POST /api/auth/login` falla (timeout, 500, sin conexion)
- **Then:**
  - `[data-testid="login-error"]` = "No pudimos procesar tu solicitud. Intenta de nuevo"
  - El formulario no se limpia (usuario puede reintentar)
  - NO se crean tokens ni cookies

---

## Paso 4: Test Design

### Test Coverage Analysis

**Total Test Cases Needed:** 15

**Breakdown:**

- Positive: 2 (login exitoso, redirect a returnUrl)
- Negative: 4 (password incorrecta, email no registrado, campos vacios, error de red)
- Boundary: 2 (5to intento = auth falla normalmente, 6to = rate limit 429)
- Security: 4 (mensaje anti-enumeration, HTTP-only cookies, open redirect protection, SQL injection)
- API: 3 (200 success, 401 INVALID_CREDENTIALS, 429 rate limit)

**Rationale:** 1 TC extra respecto al estimado del Feature Test Plan (14) por el gap de open redirect identificado en analisis. Security critical path requiere cobertura exhaustiva.

---

### Parametrization Opportunities

**Parametrized Tests Recommended:** Yes

**Parametrized Test Group 1:** Credenciales invalidas - mismo error, mismo codigo

- **Base Scenario:** Login rechazado con mensaje generico anti-enumeration
- **Test Data Sets:**

| Email                    | Password       | Caso                          | Expected Status  | Expected Message               |
| ------------------------ | -------------- | ----------------------------- | ---------------- | ------------------------------ |
| `test-login@finora.app`  | `WrongPass999` | Email OK, password incorrecto | 401              | Email o contrasena incorrectos |
| `nonexistent@finora.app` | `AnyPass123`   | Email no registrado           | 401              | Email o contrasena incorrectos |
| `admin'--@finora.app`    | `AnyPass123`   | SQL injection en email        | 401 o Zod reject | Email o contrasena incorrectos |

**Total Tests from Parametrization:** 3 -> 1 test parametrizado
**Benefit:** Valida que el sistema trata identicamente password incorrecta Y email no registrado (anti-enumeration). Si los mensajes difieren, el sistema filtra informacion de cuentas existentes.

---

### Test Outlines

---

#### Should authenticate successfully with valid credentials and redirect to dashboard

**Related Scenario:** Scenario 1
**Type:** Positive
**Priority:** Critical
**Test Level:** E2E (Playwright)
**Parametrized:** No

---

**Preconditions:**

- Usuario `login-test@finora.app` / `SecurePass123` existe en `auth.users` (fixture permanente staging)
- Usuario NO tiene sesion activa (cookies limpias)
- Se esta en `https://staging.finora.app/login`

---

**Test Steps:**

1. Navegar a `https://staging.finora.app/login`
   - **Verify:** `[data-testid="login-form"]` visible
2. Ingresar `login-test@finora.app` en `[data-testid="login-email"]`
3. Ingresar `SecurePass123` en `[data-testid="login-password"]`
4. Click en `[data-testid="login-submit"]`
   - **Verify:** Loading state visible durante autenticacion
5. **Verify:** `[data-testid="login-form"]` sin mensaje de error
6. **Verify:** URL actual = `/dashboard`

---

**Expected Result:**

- **UI:** Sin errores. Redirect a /dashboard. Loading state durante submit.
- **API Response:**
  - Status Code: `200 OK`
  - Response Body:
    ```json
    {
      "success": true,
      "data": {
        "user": { "id": "<uuid>", "email": "login-test@finora.app" },
        "session": {
          "access_token": "<jwt>",
          "refresh_token": "<jwt>",
          "expires_at": "<timestamp>"
        }
      }
    }
    ```
- **Security:**
  - Cookies con `HttpOnly=true` y `Secure=true`
  - `localStorage` NO contiene tokens JWT
  - `sessionStorage` NO contiene tokens JWT
- **System State:** Sesion activa en Supabase Auth

---

**Test Data:**

```json
{
  "input": { "email": "login-test@finora.app", "password": "SecurePass123" },
  "fixture": "permanent_staging_user"
}
```

---

**Post-conditions:** Limpiar cookies del browser (logout o borrado manual para el siguiente test)

---

#### Should redirect to original returnUrl after successful login

**Related Scenario:** Scenario 5
**Type:** Positive
**Priority:** High
**Test Level:** E2E (Playwright)
**Parametrized:** No

---

**Preconditions:**

- Usuario `login-test@finora.app` existe y tiene acceso a /dashboard/goals
- NO tiene sesion activa

---

**Test Steps:**

1. Navegar directamente a `https://staging.finora.app/dashboard/goals` (sin autenticacion)
   - **Verify:** Redirect a `/login` (con returnUrl guardada)
2. Ingresar credenciales validas en el formulario
3. Click submit
   - **Verify:** URL final = `/dashboard/goals` (no `/dashboard`)

---

**Expected Result:**

- URL = `/dashboard/goals` post-login exitoso
- El mecanismo de returnUrl funciona correctamente (query params o sessionStorage - PENDIENTE confirmacion Dev)

---

#### Should display generic error for invalid credentials - anti-enumeration (parametrized)

**Related Scenario:** Scenarios 2 + 3
**Type:** Negative
**Priority:** High
**Test Level:** E2E + API
**Parametrized:** Yes (Group 1 - 3 data sets)

---

**Preconditions:**

- `login-test@finora.app` existe en auth.users
- `nonexistent@finora.app` NO existe

---

**Test Steps (por data set):**

1. Navegar a `/login`
2. Ingresar email y password del data set
3. Click submit
4. **Verify:** `[data-testid="login-error"]` = "Email o contrasena incorrectos"
5. **Verify:** URL sigue siendo `/login`
6. **Verify:** NO hay cookies con tokens JWT

---

**Expected Result:**

- MISMO mensaje de error para todos los data sets (anti-enumeration)
- API: `401 { success: false, error: { code: "INVALID_CREDENTIALS" } }` identico en todos los casos
- NO se puede determinar si el email existe o no por el mensaje de error

---

#### Should disable submit button when email or password is empty

**Related Scenario:** N/A (gap de validation)
**Type:** Negative
**Priority:** High
**Test Level:** UI
**Parametrized:** No

---

**Test Steps:**

1. Navegar a `/login`
2. Dejar ambos campos vacios
   - **Verify:** `[data-testid="login-submit"]` deshabilitado
3. Ingresar solo email, dejar password vacio
   - **Verify:** Submit deshabilitado
4. Limpiar email, ingresar solo password
   - **Verify:** Submit deshabilitado
5. Ingresar ambos campos con datos
   - **Verify:** Submit habilitado

---

**Expected Result:**

- Submit deshabilitado cuando cualquier campo obligatorio esta vacio
- CERO calls a `POST /api/auth/login`

---

#### Should display network error message when login request fails

**Related Scenario:** Scenario 8
**Type:** Negative
**Priority:** Medium
**Test Level:** E2E (Playwright)
**Parametrized:** No

---

**Test Steps:**

1. Navegar a `/login`, ingresar credenciales validas
2. Interceptar y bloquear request a `POST /api/auth/login` (Playwright network mock)
3. Click submit
4. **Verify:** `[data-testid="login-error"]` = "No pudimos procesar tu solicitud. Intenta de nuevo"
5. **Verify:** Formulario NO se limpia (email y password siguen llenos)
6. **Verify:** NO hay cookies con tokens JWT

---

#### Should allow 5th failed attempt (normal auth failure, not rate limited)

**Related Scenario:** Scenario 4 (boundary lower)
**Type:** Boundary
**Priority:** Medium
**Test Level:** API
**Parametrized:** No

---

**Test Steps:**

1. Enviar 4 requests fallidos a `POST /api/auth/login` con credenciales incorrectas
2. Enviar 5to request fallido
   - **Verify:** Status `401 Unauthorized` (NO 429)
   - **Verify:** Body contiene `INVALID_CREDENTIALS` (NO rate limit message)

---

**Expected Result:**

- El 5to intento aun llega a Supabase Auth y falla con 401
- El rate limit se aplica DESPUES del 5to intento (en el 6to)

---

#### Should block login on 6th attempt within 15 minutes (rate limit boundary)

**Related Scenario:** Scenario 4
**Type:** Boundary / Security
**Priority:** High
**Test Level:** API
**Parametrized:** No

---

**Test Steps:**

1. Enviar 5 requests fallidos a `POST /api/auth/login` (credentials incorrectas)
2. Enviar 6to request
   - **Verify:** Status `429 Too Many Requests`
   - **Verify:** Body contiene mensaje de rate limit

---

**Expected Result:**

- API: `429 Too Many Requests`
- El 6to intento NO llega a Supabase Auth
- PREGUNTA para Dev: El rate limit aplica por IP? Por email? Por ambos?

---

#### Should store JWT tokens in HTTP-only cookies only

**Related Scenario:** Scenario 1 (aspecto de seguridad)
**Type:** Security
**Priority:** Critical
**Test Level:** E2E (Playwright)
**Parametrized:** No

---

**Test Steps:**

1. Completar login exitoso
2. **Verify:** Cookies del browser incluyen token con `HttpOnly=true` y `Secure=true`
3. **Verify:** `localStorage.getItem('supabase.auth.token')` = `null`
4. **Verify:** `sessionStorage` NO contiene tokens JWT
5. **Verify:** Cookies tienen flag `SameSite` configurado (Strict o Lax)

---

**Expected Result:**

- JWT tokens UNICAMENTE en HTTP-only cookies
- localStorage y sessionStorage sin tokens
- Cookies con Secure y SameSite flags activos

---

#### Should use identical error message for wrong password and non-existent email (anti-enumeration)

**Related Scenario:** Scenarios 2 + 3
**Type:** Security
**Priority:** Critical
**Test Level:** API
**Parametrized:** No

---

**Test Steps:**

1. `POST /api/auth/login` con email existente + password incorrecto
   - **Save:** response body completo + status code
2. `POST /api/auth/login` con email NO existente + cualquier password
   - **Save:** response body completo + status code
3. **Compare:** Los dos responses deben ser identicos (status code, error code, message)

---

**Expected Result:**

- Ambas responses: `401 { success: false, error: { code: "INVALID_CREDENTIALS", message: "Email o contrasena incorrectos" } }`
- Timing de response similar (sin information leak por tiempo de respuesta)
- CRITICO: Si las responses difieren, el sistema permite enumerar cuentas existentes

---

#### Should reject external returnUrl and redirect to dashboard (open redirect protection)

**Related Scenario:** Scenario 7
**Type:** Security
**Priority:** High
**Test Level:** E2E (Playwright)
**Parametrized:** No

---

**Test Data:**

```json
{
  "malicious_urls": [
    "https://evil.com",
    "//evil.com",
    "https://evil.com/phishing",
    "javascript:alert(1)"
  ]
}
```

**Test Steps:**

1. Navegar a `/login?returnUrl=https://evil.com`
2. Ingresar credenciales validas y hacer login
3. **Verify:** URL post-login = `/dashboard` (NO `https://evil.com`)
4. Repetir con `//evil.com` y `javascript:alert(1)` como returnUrl

---

**Expected Result:**

- Post-login redirect va a `/dashboard` para todas las URLs externas/invalidas
- La logica de redirect valida que returnUrl sea una URL relativa interna
- No hay redirect a URLs externas (previene phishing post-login)

---

#### Should return 200 with correct API contract on successful login

**Type:** API
**Priority:** Critical
**Test Level:** API (Postman)
**Parametrized:** No

---

**Test Steps:**

1. `POST /api/auth/login` con credenciales validas
2. **Verify:** Status `200 OK`
3. **Verify:** Response schema match con `api-contracts.yaml`
4. **Verify:** Response time < 300ms (NFR Auth Operations)
5. **Verify:** `expires_at` = aproximadamente ahora + 1hr

---

**Expected Result:**

- Status: `200 OK`
- Schema match completo
- Response time < 300ms (p95)
- Tokens presentes y con TTL correcto

---

#### Should return 401 INVALID_CREDENTIALS with correct schema

**Type:** API
**Priority:** High
**Test Level:** API (Postman)
**Parametrized:** No

---

**Expected Result:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email o contrasena incorrectos"
  }
}
```

- Status: `401 Unauthorized`
- Schema match con `api-contracts.yaml`

---

#### Should return 429 Too Many Requests when rate limit exceeded

**Type:** API / Security
**Priority:** High
**Test Level:** API (Postman)
**Parametrized:** No

---

**Expected Result:**

- Status: `429 Too Many Requests`
- Response incluye mensaje con tiempo de espera
- `Retry-After` header presente (si implementado)

---

#### Should redirect authenticated user from /login to /dashboard

**Related Scenario:** Scenario 6
**Type:** Security / UX
**Priority:** Medium
**Test Level:** E2E (Playwright)
**Parametrized:** No

---

**Preconditions:** Usuario con sesion activa (JWT valido en cookies)

**Test Steps:**

1. Completar login exitoso (para tener sesion activa)
2. Navegar manualmente a `https://staging.finora.app/login`
3. **Verify:** Redirect automatico a `/dashboard`
4. **Verify:** El formulario de login NO se muestra

---

**Expected Result:**

- Usuarios autenticados no ven el formulario de login
- Redirect automatico y transparente a /dashboard

---

#### Should reject SQL injection in email field before API call

**Type:** Security
**Priority:** High
**Test Level:** UI + API
**Parametrized:** No

---

**Test Data:** `email = "admin'--@example.com"`

**Test Steps:**

1. Ingresar `admin'--@example.com` en `[data-testid="login-email"]`
2. Ingresar password valida
3. **Verify:** Zod rechaza antes del submit (o error de formato invalido)
4. **Verify:** CERO calls a `POST /api/auth/login`

---

**Expected Result:**

- Zod rechaza formato invalido de email
- `[data-testid="login-error"]` muestra error de formato
- NO hay request a la API

---

## Integration Test Cases

### Integration Test 1: LoginForm -> POST /api/auth/login (contract validation)

**Integration Point:** Frontend -> Backend API
**Type:** Integration
**Priority:** High

**Preconditions:**

- Next.js server corriendo en staging
- Supabase Auth staging conectado

**Test Flow:**

1. LoginForm submits via React Hook Form
2. TanStack Query mutation -> `POST /api/auth/login`
3. API Route -> Zod server-side validation
4. API Route -> `supabase.auth.signInWithPassword()`
5. Supabase Auth -> JWT generation
6. API Route -> Set HTTP-only cookies en response
7. Frontend -> redirect a returnUrl o /dashboard

**Contract Validation:**

- Request format matches OpenAPI spec: Yes
- Response format matches OpenAPI spec: Yes
- Status codes match spec: Yes

**Expected Result:** Data flow correcto. HTTP-only cookies seteadas. Redirect a /dashboard.

---

### Integration Test 2: JWT Middleware en rutas protegidas post-login

**Integration Point:** JWT tokens (de login) -> Middleware -> Rutas protegidas
**Type:** Integration
**Priority:** Critical

**Test Flow:**

1. Completar login exitoso (tokens en cookies)
2. Navegar a `/dashboard` (ruta protegida)
3. Middleware valida JWT token de las cookies
4. Request a Supabase pasa con usuario autenticado
5. Dashboard data carga correctamente

**Expected Result:**

- JWT del login permite acceso a rutas protegidas
- Sin re-login necesario dentro del TTL del access token
- RLS en Supabase retorna solo datos del usuario autenticado

---

## Edge Cases Summary

| Edge Case                               | Covered in Original Story? | Added to Refined AC?   | Test Case      | Priority |
| --------------------------------------- | -------------------------- | ---------------------- | -------------- | -------- |
| Open redirect en returnUrl              | No                         | Yes (Scenario 7)       | TC-011         | High     |
| Usuario ya logueado en /login           | No                         | Yes (Scenario 6)       | TC-014         | Medium   |
| SQL injection en email                  | No                         | Yes (test case)        | TC-015         | High     |
| Error de red durante submit             | No                         | Yes (Scenario 8)       | TC-005         | Medium   |
| Rate limit boundary exacto (5to vs 6to) | Implicito                  | Yes (Boundary TCs)     | TC-006, TC-007 | High     |
| Anti-enumeration verificacion           | Si (Scenario 3)            | Yes (Refined)          | TC-009         | Critical |
| Access token refresh flow               | No                         | Pending Dev (pregunta) | TBD            | High     |

---

## Test Data Summary

### Data Categories

| Data Type           | Count | Purpose                       | Examples                                              |
| ------------------- | ----- | ----------------------------- | ----------------------------------------------------- |
| Valid data          | 2     | Positive tests                | `login-test@finora.app` / `SecurePass123`             |
| Invalid credentials | 3     | Negative + parametrized       | wrong pass, nonexistent email, SQL injection          |
| Security payloads   | 4     | Open redirect + SQL injection | `https://evil.com`, `//evil.com`, `admin'--@test.com` |
| Fixtures (staging)  | 1     | Login test user               | `login-test@finora.app` (permanent fixture)           |

### Data Generation Strategy

**Static Test Data:**

- `login-test@finora.app` / `SecurePass123` - fixture permanente de staging (usuario creado con FIN-2)
- SQL injection payload: `admin'--@example.com`
- Open redirect payloads: `https://evil.com`, `//evil.com`, `javascript:alert(1)`

**Dynamic Test Data (para rate limit tests):**

- Emails invalidos unicos por run: `rate-test-${Date.now()}@finora.app` (para no colisionar con otros tests)

**Test Data Cleanup:**

- `login-test@finora.app` es fixture PERMANENTE en staging (NO eliminar)
- Usuarios temporales de rate limit tests: no se crean registros, solo intentos fallidos
- Tests son idempotentes

---

## Definition of Done (QA Perspective)

Esta story se considera "Done" desde QA cuando:

- [ ] Ambiguedades y preguntas de Dev/PO resueltas
- [ ] Story actualizada con mejoras sugeridas (si aceptadas)
- [ ] Los 15 test cases ejecutados y passing
- [ ] Critical/High test cases: 100% passing
- [ ] Medium/Low test cases: >= 95% passing
- [ ] Todos los bugs criticos y altos resueltos
- [ ] Integration tests passing (JWT en rutas protegidas verificado)
- [ ] API contract validation passed para `POST /api/auth/login`
- [ ] Security tests passing (anti-enumeration, HTTP-only cookies, rate limiting, open redirect)
- [ ] NFR validado: Response time < 300ms p95
- [ ] Cross-browser testing: Chrome, Firefox, Safari (iOS P0) para HTTP-only cookies
- [ ] Regression tests passed
- [ ] Exploratory testing completado
- [ ] Test execution report generado
- [ ] No blockers para FIN-4 (logout), FIN-6 (profile edit) y rutas protegidas

---

## Related Documentation

- **Story:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/stories/STORY-FIN-3-user-login/story.md`
- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **Feature Test Plan:** Jira FIN-1 (comentario "Feature Test Plan - Generated 2026-02-24")
- **Business Model:** `.context/idea/business-model.md`
- **PRD:** `.context/PRD/` (executive-summary, user-personas, user-journeys)
- **SRS:** `.context/SRS/` (functional-specs FR-002, non-functional-specs, architecture-specs)
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

## Test Execution Tracking

[Esta seccion se completa durante ejecucion]

**Test Execution Date:** TBD
**Environment:** Staging (https://staging.finora.app)
**Executed By:** TBD

**Results:**

- Total Tests: 15
- Passed: TBD
- Failed: TBD
- Blocked: TBD

**Bugs Found:** TBD

**Sign-off:** [Nombre QA] - [Fecha]
