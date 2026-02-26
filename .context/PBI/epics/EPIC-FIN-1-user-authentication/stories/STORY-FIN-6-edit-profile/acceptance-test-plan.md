# Acceptance Test Plan: STORY-FIN-6 — Edición de Perfil de Usuario

**Fecha:** 2026-02-25
**QA Engineer:** Alfonso Hernandez (AI-Assisted Shift-Left)
**Story Jira Key:** FIN-6
**Epic:** FIN-1 — Autenticación y Gestión de Usuario
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Valentina (Joven Profesional, CDMX) — Necesita ver montos en $ MXN. Personalizar el nombre refuerza el sentido de ownership de la app. Un registro exitoso sin personalización queda incompleto como experiencia.
- **Secondary:** Carmen (Simplificadora, Madrid, EUR) — Necesita cambiar currency a EUR. Si no puede hacerlo fácilmente, la app no sirve para usuarios fuera de LatAm.

**Business Value:**

- **Value Proposition:** La personalización de perfil reduce la fricción post-onboarding. Ver montos en la propia moneda aumenta el valor percibido inmediatamente.
- **Business Impact:** Contribuye a Retention D7 (35%) y D30 (25%). Usuarios que ven la app adaptada a su moneda local tienen mayor probabilidad de seguir usándola. Completa el ciclo de personalización iniciado en FIN-2 (registro).

**Related User Journey:**

- Journey: Journey 1 — Registro y Primer Gasto (Valentina)
- Step: Post-onboarding, configuración de preferencias en /settings/profile

---

### Technical Context of This Story

**Architecture Components:**

**Frontend:**

- Components: `ProfileForm.tsx` en `/src/components/settings/`
- Pages/Routes: `/settings/profile` (App Router: `src/app/(app)/settings/profile/page.tsx`)
- State Management: React Hook Form (form state) + TanStack Query (GET y PATCH) + Zustand (session/user state)

**Backend:**

- API Endpoints:
  - `GET /api/auth/profile` — Obtener perfil actual
  - `PATCH /api/auth/profile` — Actualizar perfil
- Services: Auth Middleware (JWT validation vía Supabase Auth)
- Database: `public.profiles` (name varchar 100 nullable, currency_symbol varchar 10 default '$')

**External Services:**

- Supabase Auth — validación de JWT en cada request al Auth Middleware

**Integration Points:**

- Frontend ProfileForm → TanStack Query mutate → PATCH /api/auth/profile
- Auth Middleware → Supabase Auth (JWT validation → extract user_id)
- API Route → Supabase Client → `public.profiles` table (RLS enforced)
- TanStack Query → GET /api/auth/profile (initial form load)

---

### Story Complexity Analysis

**Overall Complexity:** Low-Medium

**Complexity Factors:**

- Business logic complexity: Low — formulario con 2 campos, lógica simple de actualización
- Integration complexity: Medium — Frontend ↔ API ↔ Supabase con RLS enforcement
- Data validation complexity: Low-Medium — validaciones simples pero RLS es crítico
- UI complexity: Low — formulario estático con dropdown de moneda

**Estimated Test Effort:** Medium
**Rationale:** Funcionalidad simple pero los 2 tests de seguridad (RLS + 401) son los más críticos y representan el mayor riesgo. El FTP del epic identifica RLS como test fundamental de esta story.

---

### Epic-Level Context (From Feature Test Plan FIN-1)

**Critical Risks Already Identified at Epic Level:**

- **Risk 1: Sincronización auth.users → public.profiles** (High/Medium)
  - **Relevance to This Story:** El perfil debe EXISTIR en `public.profiles` para poder hacer PATCH. Si el trigger/API de creación de perfil en FIN-2 falla, PATCH retornará error. FIN-6 tiene dependencia directa de FIN-2.

- **Risk 2: Supabase Auth como SPOF** (High/Low)
  - **Relevance to This Story:** El Auth Middleware valida el token contra Supabase Auth en cada request. Si Supabase está caído, PATCH /api/auth/profile fallará con 500 aunque el usuario tenga token válido.

**Integration Points from Epic Analysis:**

- Frontend ↔ API Routes → ✅ Applies (ProfileForm → PATCH /api/auth/profile)
- API Routes ↔ Supabase Auth (JWT) → ✅ Applies (mandatory auth middleware en profile endpoint)
- API Routes ↔ PostgreSQL via RLS → ✅ Applies (UPDATE profiles WHERE user_id = auth.uid())

**Critical Questions Already Asked at Epic Level:**

- **Ambiguity 3: currency_symbol ¿dropdown cerrado o input libre?**
  - **Status:** ⏳ Pending (sin respuesta en comentarios del epic)
  - **Impact on This Story:** CRÍTICO — cambia completamente el testing approach para el campo currency_symbol. Si es input libre: tests de XSS, SQL injection, unicode, boundary de 5 chars. Si es dropdown: solo validamos enum values.

**Test Strategy from Epic (aplicable a FIN-6):**

- Test Levels: Unit (Zod ProfileSchema), Integration (API↔DB+RLS), E2E (Playwright), API (Postman)
- Tools: Playwright (E2E), Vitest (Unit schemas), Postman/Newman (API contract)
- **How This Story Aligns:** 11 test cases estimados. Focus en security tests (RLS + 401) sobre functional tests.

**Summary: How This Story Fits in Epic:**

- **Story Role in Epic:** FIN-6 completa el ciclo de personalización de usuario. Es la única story que permite al usuario customizar cómo ve la app (nombre + currency). Sin FIN-6, el perfil creado en FIN-2 nunca se personaliza.
- **Inherited Risks:** Perfil debe existir (depende de FIN-2), Supabase Auth disponible (depende de servicio externo).
- **Unique Considerations:** RLS en UPDATE es el aspecto más crítico y único de esta story.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

**Ambiguity 1: currency_symbol — dropdown vs input libre**

- **Location in Story:** Technical Notes (tabla de Currency Symbols) vs DB schema (varchar 10 — acepta cualquier string)
- **Question for PO/Dev:** ¿El campo de currency es un `<select>` con opciones fijas ($, EUR, GBP, COP, ARS) o un `<input>` de texto libre?
- **Impact on Testing:** Si dropdown: solo validamos enum values. Si input libre: tests de XSS (`<script>alert(1)</script>`), unicode, caracteres especiales, y boundary de 5 chars.
- **Suggested Clarification:** Confirmar que es `<select>` con lista cerrada para MVP.

**Ambiguity 2: Mensaje de éxito — toast vs inline**

- **Location in Story:** Scenario 1 AC — "debo ver el mensaje 'Perfil actualizado exitosamente'"
- **Question for PO:** ¿Es un toast notification (desaparece en ~3s) o un mensaje inline permanente?
- **Impact on Testing:** Si es toast: el test E2E debe capturarlo inmediatamente con assertion rápida. Si es inline: el test puede verificar en cualquier momento.
- **Suggested Clarification:** Especificar tipo y duración del feedback visual.

**Ambiguity 3: Navegación sin guardar — ¿dialog de confirmación?**

- **Location in Story:** Scenario 5 original — "o navego a otra página"
- **Question for PO:** Si el usuario navega a otra ruta sin hacer clic en Cancelar, ¿hay un dialog "¿Salir sin guardar?" o se descarta silenciosamente?
- **Impact on Testing:** Si hay dialog: 2 test cases adicionales (confirmar salida, cancelar salida).
- **Suggested Clarification:** Definir el comportamiento del router/beforeRouteLeave guard.

**Ambiguity 4: Actualización de currency en UI**

- **Location in Story:** Scenario 2 AC — "todos los montos en la aplicación deben mostrarse con 'EUR'"
- **Question for Dev:** ¿El cambio de currency_symbol actualiza el estado global inmediatamente (TanStack Query invalidation + Zustand store update) o requiere navegación/reload?
- **Impact on Testing:** Si requiere reload: el test E2E debe navegar fuera y volver para verificar.
- **Suggested Clarification:** Definir el mecanismo de propagación del cambio de currency.

---

### Missing Information / Gaps

**Gap 1: No hay AC para error de red durante PATCH**

- **Type:** Acceptance Criteria
- **Why It's Critical:** Si la red cae durante el guardado, el usuario no sabe si el perfil se guardó o no. Gap ya identificado en FTP para FIN-2/3/5.
- **Suggested Addition:** "Si hay error de red durante el guardado, mostrar mensaje 'No pudimos actualizar tu perfil. Intenta de nuevo' con botón retry."
- **Impact if Not Added:** Errores de red sin manejo causan UX confusa y pérdida de confianza del usuario.

**Gap 2: No hay AC para formulario con perfil recién creado (name=null)**

- **Type:** Business Rule
- **Why It's Critical:** Un usuario nuevo tiene name=null. La story asume pre-carga de valores pero no especifica el estado inicial del formulario.
- **Suggested Addition:** "El formulario pre-carga: campo nombre vacío si name=null; currency_symbol='$' por defecto."
- **Impact if Not Added:** Posible rendering incorrecto del formulario para usuarios nuevos.

**Gap 3: No hay AC para comportamiento sin autenticación**

- **Type:** Security / Acceptance Criteria
- **Why It's Critical:** Cualquier endpoint debe rechazar requests no autenticados. No está especificado en la story.
- **Suggested Addition:** Scenario 6 (ya agregado en Refined AC): "PATCH sin token → 401 Unauthorized."
- **Impact if Not Added:** Sin test de seguridad explícito, puede quedar vulnerable.

---

### Edge Cases NOT Covered in Original Story

**Edge Case 1: Doble clic en "Guardar" (race condition)**

- **Scenario:** Usuario hace doble clic rápidamente → ¿se lanzan 2 PATCH requests simultáneos?
- **Expected Behavior:** Botón debe deshabilitarse al primer clic (loading state) para prevenir duplicates.
- **Criticality:** Medium
- **Action Required:** Add to test cases only

**Edge Case 2: Nombres con caracteres especiales**

- **Scenario:** "José García", "María Ñoño", "Juan 😊", `<script>alert(1)</script>`
- **Expected Behavior:** Acentos y ñ: deben permitirse. Emojis: a confirmar con PO. XSS: React auto-escaping previene rendering, pero Zod debe sanitizar en servidor.
- **Criticality:** Medium
- **Action Required:** Ask PO (emojis), add security test (XSS injection en nombre)

**Edge Case 3: currency_symbol en boundary de 5 chars**

- **Scenario:** Ingresar "USDBR" (exactamente 5 chars) si es input libre
- **Expected Behavior:** Debe aceptarse (FR-005: max 5 chars → boundary = valid)
- **Criticality:** Medium
- **Action Required:** Add to test cases (solo aplica si currency es input libre)

**Edge Case 4: Formulario de usuario nuevo (name=null, currency='$' default)**

- **Scenario:** Usuario que acaba de registrarse abre /settings/profile por primera vez
- **Expected Behavior:** Campo nombre vacío, currency_symbol='$' pre-seleccionado
- **Criticality:** Medium
- **Action Required:** Add to test cases

---

### Testability Validation

**Is this story testeable as written?** ⚠️ Partially

**Testability Issues:**

- [x] Mensaje de error exacto en Scenario 3 — clarificado: "El nombre no puede exceder 100 caracteres"
- [x] Falta AC para autenticación requerida — agregado como Scenario 8 y 9
- [ ] currency_symbol no clarificado (dropdown vs libre) — bloquea subset de tests

**Recommendations to Improve Testability:**

1. Especificar mensaje de éxito exacto (para assertion en test) y tipo (toast/inline)
2. Clarificar currency_symbol: dropdown o input libre
3. Agregar AC para error de red (Gap 1)

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Actualizar nombre de display con datos válidos

**Type:** Positive
**Priority:** Critical

- **Given:**
  - Usuario autenticado como "valentina.test@finora.app"
  - En /settings/profile con form pre-cargado (name="Juan Garcia", currency_symbol="$")
- **When:**
  - Limpia `[data-testid="profile-name"]` e ingresa "Maria Lopez"
  - Hace clic en `[data-testid="profile-save"]`
- **Then:**
  - `[data-testid="profile-success"]` muestra "Perfil actualizado exitosamente"
  - DB: `SELECT name FROM profiles WHERE user_id = auth.uid()` → "Maria Lopez"
  - Header de la app muestra "Maria Lopez"
  - API Response: `{ "success": true, "data": { "name": "Maria Lopez", "currency_symbol": "$", "updated_at": "..." } }` — Status 200 OK

---

### Scenario 2: Actualizar currency_symbol exitosamente

**Type:** Positive
**Priority:** Critical

- **Given:**
  - Usuario autenticado en /settings/profile
  - currency_symbol actual = "$"
- **When:**
  - Selecciona "EUR" en `[data-testid="profile-currency"]`
  - Hace clic en `[data-testid="profile-save"]`
- **Then:**
  - Muestra "Perfil actualizado exitosamente"
  - DB: profiles.currency_symbol = "EUR"
  - API Response: `{ "success": true, "data": { "currency_symbol": "EUR" } }` — Status 200 OK
  - Los montos en la app usan "EUR" (**⚠️ NOTE: pendiente confirmar si es inmediato o requiere reload**)

---

### Scenario 3: Actualizar nombre Y currency_symbol simultáneamente

**Type:** Positive
**Priority:** High

- **Given:** Usuario autenticado en /settings/profile
- **When:**
  - Escribe "Andrés Ramirez" en profile-name
  - Selecciona "GBP" en profile-currency
  - Hace clic en profile-save
- **Then:**
  - Request PATCH contiene: `{ "name": "Andrés Ramirez", "currency_symbol": "GBP" }`
  - Ambos campos actualizados en DB en un solo request
  - Status 200 OK

---

### Scenario 4: Error cuando nombre excede 100 caracteres

**Type:** Negative
**Priority:** High

- **Given:** Usuario en /settings/profile
- **When:** Ingresa string de 101 caracteres en `[data-testid="profile-name"]`
- **Then:**
  - `[data-testid="profile-error"]` muestra "El nombre no puede exceder 100 caracteres"
  - `[data-testid="profile-save"]` tiene atributo `disabled`
  - NO se envía ningún request PATCH al backend (validación client-side)
  - DB: sin cambios

---

### Scenario 5: Nombre en el límite exacto de 100 caracteres (boundary)

**Type:** Boundary
**Priority:** Medium

- **Given:** Usuario en /settings/profile
- **When:** Ingresa string de exactamente 100 caracteres en profile-name y hace clic en Guardar
- **Then:**
  - NO muestra error de validación
  - profile-save está habilitado
  - PATCH se envía con name = string de 100 chars exactos
  - Status 200 OK — guardado exitoso

---

### Scenario 6: Guardar perfil con nombre vacío (campo opcional)

**Type:** Edge Case
**Priority:** Medium
**Source:** Identified in Paso 2 — Gap 2

- **Given:** Usuario en /settings/profile con name="Juan Garcia"
- **When:**
  - Limpia completamente el campo profile-name
  - Hace clic en profile-save
- **Then:**
  - Request PATCH contiene: `{ "name": null }` o `{ "name": "" }`
  - Status 200 OK
  - DB: profiles.name = null
  - Header muestra email del usuario o icono genérico (no un nombre)

---

### Scenario 7: Cancelar cambios sin guardar

**Type:** Edge Case
**Priority:** Medium

- **Given:**
  - Usuario en /settings/profile con name="Juan Garcia"
  - Ha cambiado el campo a "Carlos Martinez" pero NO ha guardado
- **When:** Hace clic en `[data-testid="profile-cancel"]`
- **Then:**
  - El campo profile-name vuelve a mostrar "Juan Garcia"
  - NO se lanza ningún request PATCH
  - DB: sin cambios (profiles.name = "Juan Garcia")

---

### Scenario 8: PATCH sin token de autenticación → 401

**Type:** Security
**Priority:** Critical
**Source:** Identified in Paso 2 — Gap 3 (nuevo, no estaba en story original)

- **Given:** Request API directo sin Authorization header (o con token inválido/expirado)
- **When:** `PATCH /api/auth/profile` con body `{ "name": "Hacker" }` sin token
- **Then:**
  - Status: 401 Unauthorized
  - Response: `{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "Sesión inválida" } }`
  - DB: sin cambios

---

### Scenario 9: RLS — usuario no puede editar perfil de otro usuario

**Type:** Security
**Priority:** Critical
**Source:** Identified in Paso 2 (nuevo, no estaba en story original)

- **Given:**
  - User A autenticado con token válido
  - User B existente con perfil independiente
- **When:** User A envía `PATCH /api/auth/profile`
- **Then:**
  - Supabase RLS garantiza que UPDATE solo aplica `WHERE user_id = auth.uid()` (User A)
  - El perfil de User B permanece sin cambios
  - Cualquier `user_id` especificado en el body es ignorado por RLS

---

## 🧪 Paso 4: Test Design

### Test Coverage Analysis

**Total Test Cases Needed:** 11

**Breakdown:**

- Positive: 3 test cases
- Negative: 1 test case
- Boundary: 1 test case
- Edge Cases: 2 test cases
- Security: 2 test cases
- API Contract: 1 test case
- Integration: 1 test case

**Rationale for This Number:**
FIN-6 es funcionalidad simple (2 campos). Los 11 test cases son adecuados: 3 positivos cubren los happy paths, 1 negativo la validación crítica, 1 boundary el límite de nombre, 2 edge cases los comportamientos atípicos, y 2 security los tests más críticos de esta story (RLS + 401). No se fuerzan más casos — la complejidad real es Low-Medium.

---

### Parametrization Opportunities

**Parametrized Tests Recommended:** ✅ Yes

**Parametrized Test Group 1: Validación de longitud del nombre**

- **Base Scenario:** Validar comportamiento del campo nombre según cantidad de caracteres
- **Parameters to Vary:** Longitud del string del nombre
- **Test Data Sets:**

| Nombre (input)   | Chars | Expected UI                                                     | Expected PATCH                | DB Result        |
| ---------------- | ----- | --------------------------------------------------------------- | ----------------------------- | ---------------- |
| `""` (vacío)     | 0     | Sin error                                                       | ✅ Se envía (name=null)       | name=null        |
| `"A"`            | 1     | Sin error                                                       | ✅ Se envía                   | name="A"         |
| string 50 chars  | 50    | Sin error                                                       | ✅ Se envía                   | name=[50 chars]  |
| string 100 chars | 100   | Sin error                                                       | ✅ Se envía (boundary válido) | name=[100 chars] |
| string 101 chars | 101   | ❌ "El nombre no puede exceder 100 caracteres" + botón disabled | ❌ NO se envía                | Sin cambio       |

**Total Tests from Parametrization:** 5 variaciones
**Benefit:** Reduce duplicación, cubre happy paths, boundary y negative en un único test parametrizado.

---

### Nomenclatura de Test Outlines

**Formato empleado:** `Validar <CORE> <CONDITIONAL>`

---

### Test Outlines

---

#### Validar actualización de nombre exitosa con datos válidos

**Related Scenario:** Scenario 1
**Type:** Positive
**Priority:** Critical
**Test Level:** E2E (UI + API + DB)
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario "valentina.test@finora.app" autenticado con sesión válida
- Perfil existente en DB: name="Juan Garcia", currency_symbol="$"
- Navegador en /settings/profile

---

**Test Steps:**

1. Navegar a `/settings/profile`
   - **Verify:** `[data-testid="profile-form"]` visible
   - **Verify:** `[data-testid="profile-name"]` muestra "Juan Garcia"
2. Limpiar `[data-testid="profile-name"]` e ingresar "Maria Lopez"
   - **Data:** name: `"Maria Lopez"`
3. Hacer clic en `[data-testid="profile-save"]`
   - **Verify:** Sin errores de validación visibles
4. Verificar mensaje de éxito
   - **Verify:** `[data-testid="profile-success"]` contiene "Perfil actualizado exitosamente"
5. Verificar header de la aplicación
   - **Verify:** Header muestra "Maria Lopez"

---

**Expected Result:**

- **UI:** `profile-success` visible con mensaje correcto
- **API Response:**
  - Status Code: 200 OK
  - Response Body:
    ```json
    {
      "success": true,
      "data": {
        "name": "Maria Lopez",
        "currency_symbol": "$",
        "updated_at": "[ISO timestamp reciente]"
      }
    }
    ```
- **Database:**
  - Table: `public.profiles`
  - Query: `SELECT name FROM profiles WHERE user_id = auth.uid()`
  - Expected: `"Maria Lopez"`

---

**Test Data:**

```json
{
  "user": { "email": "valentina.test@finora.app", "role": "authenticated" },
  "initial_state": { "name": "Juan Garcia", "currency_symbol": "$" },
  "input": { "name": "Maria Lopez" }
}
```

---

**Post-conditions:**

- profiles.name = "Maria Lopez" en DB
- Cleanup: Restaurar name="Juan Garcia" para no afectar otros tests

---

#### Validar actualización de currency_symbol exitosa con selección EUR

**Related Scenario:** Scenario 2
**Type:** Positive
**Priority:** Critical
**Test Level:** E2E (UI + API + DB)
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario autenticado en /settings/profile
- currency_symbol actual = "$"

---

**Test Steps:**

1. Navegar a /settings/profile
   - **Verify:** `profile-currency` muestra "$" como valor actual
2. Seleccionar "EUR" en `[data-testid="profile-currency"]`
3. Hacer clic en `[data-testid="profile-save"]`
4. Verificar mensaje de éxito
   - **Verify:** `profile-success` contiene "Perfil actualizado exitosamente"
5. Verificar cambio de currency en la app
   - **Verify:** Los montos en la app usan "EUR" (**⚠️ pendiente: inmediato vs post-reload**)

---

**Expected Result:**

- **UI:** "Perfil actualizado exitosamente" visible
- **API Response:** Status 200, `{ "success": true, "data": { "currency_symbol": "EUR" } }`
- **Database:** `profiles.currency_symbol = "EUR"`

---

**Test Data:**

```json
{
  "input": { "currency_symbol": "EUR" },
  "initial_state": { "currency_symbol": "$" }
}
```

---

#### Validar validación de longitud del nombre — parametrizado

**Related Scenario:** Scenario 4 + 5
**Type:** Negative + Boundary
**Priority:** High
**Test Level:** UI + API
**Parametrized:** ✅ Yes (Group 1)

---

**Preconditions:**

- Usuario autenticado en /settings/profile

---

**Test Data Sets (parametrización):**

| Input (nombre)           | Chars | Expected UI                                                     | Expected PATCH | DB         |
| ------------------------ | ----- | --------------------------------------------------------------- | -------------- | ---------- |
| `""`                     | 0     | Sin error de validación                                         | ✅ Se envía    | name=null  |
| `"A"`                    | 1     | Sin error de validación                                         | ✅ Se envía    | name="A"   |
| string 50 chars          | 50    | Sin error de validación                                         | ✅ Se envía    | name=[50]  |
| string 100 chars exactos | 100   | Sin error de validación                                         | ✅ Se envía    | name=[100] |
| string 101 chars         | 101   | ❌ "El nombre no puede exceder 100 caracteres" + botón disabled | ❌ NO se envía | Sin cambio |

---

**Expected Result (caso 101 chars):**

- **UI:** `profile-error` muestra "El nombre no puede exceder 100 caracteres"
- **UI:** `profile-save` tiene atributo `disabled`
- **API:** NO se envió ningún request PATCH
- **Database:** Sin cambios

---

#### Validar guardado de perfil con nombre vacío cuando el campo es opcional

**Related Scenario:** Scenario 6
**Type:** Edge Case
**Priority:** Medium
**Test Level:** E2E (UI + API + DB)
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario autenticado en /settings/profile con name="Juan Garcia"

---

**Test Steps:**

1. Navegar a /settings/profile
2. Limpiar completamente el campo `[data-testid="profile-name"]`
3. Hacer clic en `[data-testid="profile-save"]`
4. Verificar éxito
   - **Verify:** `profile-success` visible
5. Verificar comportamiento del header
   - **Verify:** Header muestra email del usuario (NO un nombre) o icono genérico

---

**Expected Result:**

- **UI:** "Perfil actualizado exitosamente" visible; header sin nombre
- **API Response:** Status 200, `{ "success": true, "data": { "name": null } }`
- **Database:** `profiles.name = null`

---

#### Validar descarte de cambios al hacer clic en Cancelar sin haber guardado

**Related Scenario:** Scenario 7
**Type:** Edge Case
**Priority:** Medium
**Test Level:** UI
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario autenticado en /settings/profile
- Estado inicial: name="Juan Garcia"

---

**Test Steps:**

1. Navegar a /settings/profile
2. Modificar `[data-testid="profile-name"]` → escribir "Carlos Martinez" (sin guardar)
3. Hacer clic en `[data-testid="profile-cancel"]`
4. Verificar que el campo vuelve al valor original
   - **Verify:** `profile-name` contiene "Juan Garcia"
5. Verificar que no se lanzó ningún request
   - **Verify:** Network tab / mock interceptor — NO request PATCH registrado

---

**Expected Result:**

- **UI:** Campo vuelve a "Juan Garcia"
- **API:** NO se envió ningún request PATCH
- **Database:** `profiles.name = "Juan Garcia"` (sin cambios)

---

#### Validar rechazo de PATCH sin token de autenticación

**Related Scenario:** Scenario 8
**Type:** Security
**Priority:** Critical
**Test Level:** API
**Parametrized:** ❌ No

---

**Preconditions:**

- Ninguna sesión activa / sin Authorization header

---

**Test Steps:**

1. Enviar `PATCH /api/auth/profile` sin Authorization header
   - **Data:** body: `{ "name": "Hacker" }`
2. Verificar response

---

**Expected Result:**

- **Status Code:** 401 Unauthorized
- **Response Body:**
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Sesión inválida"
    }
  }
  ```
- **Database:** NO changes — verificar que `profiles.name` no fue modificado

---

**Test Data:**

```json
{
  "headers": {},
  "body": { "name": "Hacker" }
}
```

---

#### Validar RLS previene edición de perfil de otro usuario

**Related Scenario:** Scenario 9
**Type:** Security
**Priority:** Critical
**Test Level:** API + DB
**Parametrized:** ❌ No

---

**Preconditions:**

- User A: "user-a.test@finora.app" — token válido obtenido via login
- User B: "user-b.test@finora.app" — perfil existente con name="User B Original Name"

---

**Test Steps:**

1. Autenticarse como User A → obtener token válido
2. Enviar `PATCH /api/auth/profile` con token de User A
   - **Data:** body: `{ "name": "HACKED by User A" }`
3. Verificar que el request fue exitoso para User A
   - **Verify:** Status 200 para el perfil de User A
4. Verificar integridad del perfil de User B
   - **Verify:** `SELECT name FROM profiles WHERE user_id = [User B ID]` → "User B Original Name" (sin cambio)

---

**Expected Result:**

- **User A profile:** Actualizado correctamente (Status 200)
- **User B profile:** Sin cambios — "User B Original Name" intacto
- **Mechanism:** Supabase RLS agrega `WHERE user_id = auth.uid()` automáticamente, haciendo imposible modificar el perfil de otro usuario

---

#### Validar contrato API de PATCH /api/auth/profile

**Related Scenario:** Scenarios 1-3
**Type:** API Contract
**Priority:** High
**Test Level:** API (Postman)
**Parametrized:** ❌ No

---

**Test Steps:**

1. Autenticarse y obtener token válido
2. Enviar `PATCH /api/auth/profile`
   - **Data:** `{ "name": "Test User", "currency_symbol": "EUR" }`
3. Validar response structure vs FR-005 spec

---

**Expected Result:**

- **Status:** 200 OK
- **Response Body:**
  ```json
  {
    "success": true,
    "data": {
      "id": "[uuid]",
      "user_id": "[uuid]",
      "name": "Test User",
      "currency_symbol": "EUR",
      "updated_at": "[ISO timestamp]"
    }
  }
  ```
- **Headers:** `Content-Type: application/json`

---

## 🔗 Integration Test Cases

### Integration Test 1: ProfileForm → PATCH /api/auth/profile → Supabase profiles

**Integration Point:** Frontend React Hook Form → Next.js API Route → Supabase PostgreSQL (RLS)
**Type:** Integration
**Priority:** High

**Preconditions:**

- Backend API corriendo (staging)
- Frontend puede alcanzar el API endpoint
- Usuario autenticado con perfil existente en DB

**Test Flow:**

1. `ProfileForm.tsx` llama a `mutate({ name, currency_symbol })` via TanStack Query
2. TanStack Query ejecuta `PATCH /api/auth/profile` con JWT cookie
3. Auth Middleware valida JWT via Supabase Auth → extrae `user_id`
4. API Route ejecuta `supabase.from('profiles').update(data).eq('user_id', uid)`
5. Supabase RLS verifica `auth.uid() = user_id` antes de permitir UPDATE
6. Response 200 llega al frontend → TanStack Query invalida caché → UI re-renders

**Contract Validation:**

- Request format matches FR-005: `{ name: string|null, currency_symbol: string }` ✅
- Response format matches contract: `{ success: true, data: { id, user_id, name, currency_symbol, updated_at } }` ✅
- Status codes match: 200 success, 401 unauthorized ✅

**Expected Result:**

- Integration exitosa: datos fluyen correctamente Frontend → API → DB → API → Frontend
- No pérdida de datos ni transformaciones inesperadas

---

## 📊 Edge Cases Summary

| Edge Case                            | Cubierto en Story Original | Agregado a Refined AC        | Test Case | Priority |
| ------------------------------------ | -------------------------- | ---------------------------- | --------- | -------- |
| Nombre vacío (null)                  | ✅ Scenario 4              | ✅ Scenario 6 (detallado)    | TC-6      | Medium   |
| Cancelar sin guardar                 | ✅ Scenario 5              | ✅ Scenario 7 (detallado)    | TC-7      | Medium   |
| Sin autenticación (401)              | ❌ No                      | ✅ Scenario 8 (nuevo)        | TC-8      | Critical |
| RLS cross-user bypass                | ❌ No                      | ✅ Scenario 9 (nuevo)        | TC-9      | Critical |
| Doble clic en Guardar                | ❌ No                      | ⚠️ Necesita confirmación Dev | TBD       | Medium   |
| Caracteres especiales (ñ, emojis)    | ❌ No                      | ⚠️ Necesita confirmación PO  | TBD       | Medium   |
| Nombre = 100 chars (boundary)        | ❌ No                      | ✅ Parametrizado             | TC-4b     | Medium   |
| currency_symbol = 5 chars (boundary) | ❌ No                      | ⚠️ Solo si input libre       | TBD       | Medium   |

---

## 🗂️ Test Data Summary

### Data Categories

| Data Type          | Count | Purpose                   | Examples                                         |
| ------------------ | ----- | ------------------------- | ------------------------------------------------ |
| Valid data         | 5     | Positive + boundary tests | "Maria Lopez", "EUR", "GBP", string 100 chars    |
| Invalid data       | 1     | Negative test             | String 101 chars en nombre                       |
| Boundary values    | 2     | Boundary tests            | 100 chars (valid), 101 chars (invalid)           |
| Edge case data     | 2     | Edge case tests           | name=null (empty), name="Juan Garcia" pre-cancel |
| Security test data | 2     | Auth + RLS tests          | Sin token, User A + User B pair                  |

### Data Generation Strategy

**Static Test Data:**

- `valentina.test@finora.app` — usuario principal de prueba (happy paths)
- `user-a.test@finora.app` / `user-b.test@finora.app` — par para test de RLS
- `"Maria Lopez"` — nombre válido de reemplazo
- `"Juan Garcia"` — nombre inicial en estado previo

**Dynamic Test Data (usando Faker.js):**

- Nombres válidos: `faker.person.fullName()` (max 100 chars)
- String de 100 chars: `faker.string.alpha(100)`
- String de 101 chars: `faker.string.alpha(101)`
- Emails únicos: `faker.internet.email()` (para usuarios de prueba frescos en E2E)

**Test Data Cleanup:**

- ✅ Restaurar nombre al valor original después de tests de actualización
- ✅ Tests son idempotentes (pueden correr múltiples veces)
- ✅ Tests de RLS no modifican el perfil de User B (solo verifican integridad)

---

## 📝 PARTE 2: Integración y Output

### Paso 5: Story Actualizada en Jira

- ✅ Description refinada con Scenarios 6 y 7 de seguridad agregados
- ✅ Scenario 3 con mensaje de error exacto y comportamiento preciso
- ✅ Scenario 4 clarificado: name=null en DB, email como fallback en header
- ✅ Edge cases identificados documentados
- ✅ Open questions listadas
- ✅ Label `shift-left-reviewed` agregada

### Paso 6: Comentario en Jira

- ✅ Acceptance Test Plan completo agregado como comentario en FIN-6
- ✅ Team tagged para review (@PO, @Dev, @QA)
- ✅ Action Required checklist incluido

---

## 📎 Related Documentation

- **Story:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/stories/STORY-FIN-6-edit-profile/story.md`
- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **Feature Test Plan:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/feature-test-plan.md`
- **Business Model:** `.context/idea/business-model.md`
- **PRD:** `.context/PRD/` (executive-summary, user-personas, user-journeys)
- **SRS Functional:** `.context/SRS/functional-specs.md` (FR-005)
- **Architecture:** `.context/SRS/architecture-specs.md`
- **Jira Story:** FIN-6

---

## 📋 Test Execution Tracking

[Esta sección se completa durante ejecución]

**Test Execution Date:** TBD
**Environment:** Staging
**Executed By:** TBD

**Results:**

- Total Tests: 11
- Passed: TBD
- Failed: TBD
- Blocked: TBD

**Bugs Found:**

- TBD

**Sign-off:** TBD

---

## 🎯 Definition of Done (QA Perspective)

Esta story se considera "Done" desde QA cuando:

- [ ] Todas las ambigüedades y open questions de este documento son resueltas
- [ ] Story actualizada con mejoras sugeridas (si PO las acepta)
- [ ] Todos los 11 test cases ejecutados
- [ ] Critical/High test cases: 100% passing (TC-1, TC-2, TC-8, TC-9 son Critical)
- [ ] Medium/Low test cases: ≥95% passing
- [ ] Todos los bugs críticos y altos resueltos y verificados
- [ ] Integration test passing (ProfileForm → API → Supabase RLS)
- [ ] API contract validation passed (PATCH + GET)
- [ ] RLS enforcement verificado (TC-9: cross-user bypass attempt)
- [ ] Test execution report generado
- [ ] No blockers para otras stories del epic

---

_Documento generado: 2026-02-25_
_Metodología: Shift-Left Testing | Jira-First → Local Mirror_
_Versión: 1.0 — Draft_
