# Test Cases: FIN-4 - Cierre de Sesion

**Fecha:** 2026-02-25
**QA Engineer:** AI-Generated (Shift-Left Analysis)
**Story Jira Key:** FIN-4
**Epic:** FIN-1 - Autenticacion y Gestion de Usuario
**Status:** Draft

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Valentina (26, Joven Profesional) — El logout protege sus datos financieros cuando deja el dispositivo desatendido o presta su equipo. Su pain point "me da miedo que alguien acceda a mis datos" hace critico que el logout sea completo y confiable. Un logout incompleto destruye la confianza en la app.
- **Secondary:** Andres (32, Freelancer) — Trabaja desde coworkings y dispositivos compartidos. Un logout incompleto (cookies no eliminadas) expone sus ingresos freelance y metas de ahorro en dispositivos publicos.

**Business Value:**

- **Value Proposition:** "Control total de datos sin riesgos de seguridad." Si los datos financieros quedan expuestos post-logout, la propuesta de valor central de Finora queda comprometida.
- **Business Impact:** Impacta Retention D30 (objetivo: 25%). Un incidente de seguridad por logout incompleto genera abandono permanente y reviews negativas. Para usuarios como Valentina que comparten dispositivos, la confianza en el logout es critica para la retencion.

**Related User Journey:**

- Journey: Journey 1 - Registro y Primer Gasto (Valentina)
- Step: Session management — la fase de "salida segura" que complementa el login del Step 4. Un buen logout da confianza para volver a usar la app.

---

### Technical Context of This Story

**Architecture Components:**

**Frontend:**

- Components: `LogoutButton.tsx` en `/src/components/auth/`, User Menu dropdown en Header
- Pages/Routes: Disponible desde TODAS las rutas del dashboard (header global)
- State Management: TanStack Query (`queryClient.clear()`), HTTP-only cookies (eliminacion post-logout)

**Backend:**

- API Endpoints: `POST /api/auth/logout`
- Services: Supabase Auth (`supabase.auth.signOut()`)
- Database: `auth.users` (Supabase managed) — invalidacion de sesion activa

**External Services:**

- Supabase Auth (invalidacion de sesion server-side, JWT management)

**Integration Points:**

1. LogoutButton (UI) → `POST /api/auth/logout` (API Route)
2. API Route → Supabase Auth (`signOut()`) — invalidacion server-side
3. API Route → HTTP-only cookies (delete `access_token`, `refresh_token`)
4. Frontend → `queryClient.clear()` (TanStack Query state)
5. Frontend → `router.push('/login')` (Next.js navigation)
6. Auth Middleware → Supabase JWT validation (proteccion de rutas post-logout)

---

### Story Complexity Analysis

**Overall Complexity:** Low-Medium

**Complexity Factors:**

- Business logic complexity: Low — flujo lineal: call API → clear state → redirect
- Integration complexity: Medium — 6 integration points, cookie management cross-browser
- Security complexity: High — limpieza completa de credenciales critica para prevenir session hijacking
- UI complexity: Low — dos puntos de acceso (boton directo + dropdown menu)

**Estimated Test Effort:** Medium
**Rationale:** Funcionalidad simple pero con implicaciones de seguridad altas. Los tests de cookies y cache son mas tecnicos que funcionales. El edge case del "resilient logout" (backend failure) es el mas critico y menos obvio.

---

### Epic-Level Context (From Feature Test Plan in Jira FIN-1)

**Critical Risks Already Identified at Epic Level:**

- Risk 4: JWT Token Refresh Flow (Impact: High, Likelihood: Low)
  - **Relevance to This Story:** Scenario 4 (auto-logout de sesion expirada) valida exactamente este riesgo. El sistema debe intentar refresh primero y, si falla, ejecutar logout automatico.

**Integration Points from Epic Analysis:**

- Integration Point: Frontend ↔ HTTP-only Cookies (JWT storage)
  - **Applies to This Story:** ✅ Yes
  - **If Yes:** El logout debe eliminar AMBAS cookies (`access_token` + `refresh_token`). Si solo elimina una, un atacante con acceso al dispositivo puede usar la restante para autenticarse.

**Critical Questions Already Asked at Epic Level:**

**Questions for PO:**

- Question: Confirmar comportamiento esperado de sesion multi-tab post-logout (FIN-4)
  - **Status:** ⏳ Pending
  - **Impact on This Story:** Alto. Determina si se necesitan test cases de multi-tab y si el comportamiento actual (401 en proxima accion) es el esperado o se requiere invalidacion inmediata via WebSocket/Broadcast Channel.

**Test Strategy from Epic:**

- Test Levels: E2E (Playwright), API (Postman/Newman)
- Tools: Playwright (E2E), Postman (API endpoint)
- Estimate: 8 TCs para FIN-4
- **How This Story Aligns:** Playwright para flujo E2E completo + verificacion de cookies. Postman para API contract. No requiere Vitest unit tests propios.

**Summary: How This Story Fits in Epic:**

- **Story Role in Epic:** FIN-4 cierra el "session lifecycle" iniciado en FIN-3 (login). Es la validacion de que el sistema puede terminar sesiones de forma segura y completa.
- **Inherited Risks:** Risk 4 (JWT refresh flow) es directamente relevante — Scenario 4 lo valida.
- **Unique Considerations:** El "resilient logout" (funciona aunque el backend falle) es unico de esta story y no fue cubierto a nivel epic. Es el edge case mas critico.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

**Ambiguity 1:** Comportamiento de sesion multi-tab / multi-dispositivo

- **Location in Story:** Falta en Acceptance Criteria
- **Question for PO:** Si el usuario hace logout en el Tab A, ¿el Tab B queda invalidado automaticamente o solo en la proxima accion?
- **Impact on Testing:** Sin esta clarificacion no podemos testear el comportamiento multi-tab. Si se implementa sincronizacion real-time (Broadcast Channel o polling), hay test cases adicionales.
- **Suggested Clarification:** Agregar AC: "Si el usuario tiene sesiones en multiples tabs, el logout invalida el token en Supabase; los otros tabs recibiran 401 en la proxima accion y seran redirigidos a login."

**Ambiguity 2:** TanStack Query cache: AC vs Technical Notes

- **Location in Story:** Solo en Technical Notes, no en Acceptance Criteria
- **Question for Dev:** ¿La limpieza del TanStack Query cache es AC verificable o detalle de implementacion?
- **Impact on Testing:** Si es AC, lo testeamos. Si es impl detail, lo mencionamos como "assumed" pero no es criterio de falla.
- **Suggested Clarification:** Moverlo a AC formal — critico para dispositivos compartidos (el usuario B del mismo dispositivo no debe ver datos del usuario A).

**Ambiguity 3:** Toast "Sesion cerrada"

- **Location in Story:** UI/UX Considerations — "Opcionalmente mostrar toast"
- **Question for PO:** ¿Es AC obligatorio o nice-to-have para esta iteracion?
- **Impact on Testing:** Si es requisito, agrega 1 test case adicional.

---

### Missing Information / Gaps

**Gap 1:** Logout resiliente cuando el backend falla — **CRITICO**

- **Type:** Acceptance Criteria / Business Rule
- **Why It's Critical:** Technical Notes dicen "El logout debe funcionar incluso si el backend falla (limpiar cookies localmente)". Esto es un requisito funcional critico de seguridad que NO esta en los AC.
- **Suggested Addition:** Agregar Scenario 5: "Given el API falla, When el usuario intenta logout, Then las cookies locales son eliminadas de todas formas y el usuario es redirigido a /login."
- **Impact if Not Added:** Dev puede no implementarlo. En produccion, un problema de red dejaria al usuario con tokens activos en las cookies — incidente de seguridad.

**Gap 2:** Texto exacto del mensaje de sesion expirada

- **Type:** Acceptance Criteria (texto especifico para test de UI)
- **Why It's Critical:** La story local dice "Sesion expirada. Por favor inicia sesion nuevamente" pero el Jira original solo dice "Sesion expirada". Para tests de UI, el texto exacto importa.
- **Suggested Addition:** Confirmar y documentar el mensaje exacto en los AC.
- **Impact if Not Added:** Tests de UI flaky por texto incorrecto.

---

### Edge Cases NOT Covered in Original Story

**Edge Case 1:** Logout con backend fallando (resilient logout)

- **Scenario:** ¿Que pasa si el usuario hace logout pero la red falla o el servidor devuelve 500?
- **Expected Behavior:** Las cookies locales se eliminan de todas formas. El usuario es redirigido a /login.
- **Criticality:** High
- **Action Required:** Add to story (esta en Notes pero no en AC)

**Edge Case 2:** Double-click rapido en el boton de logout

- **Scenario:** ¿Que pasa si el usuario hace doble-click en "Cerrar sesion"?
- **Expected Behavior:** Solo se envia un request. El boton se deshabilita despues del primer click (loading state).
- **Criticality:** Low
- **Action Required:** Add to test cases only

**Edge Case 3:** Sesion expirada en medio de una operacion

- **Scenario:** Access token expira mientras el usuario completa un formulario de transaccion.
- **Expected Behavior:** Middleware intenta refresh primero. Si falla, redirect a login. Formulario incompleto se pierde.
- **Criticality:** Medium
- **Action Required:** Ask PO (¿se guarda estado del formulario?)

---

### Testability Validation

**Is this story testeable as written?** ⚠️ Partially

**Testability Issues:**

- [x] Missing error scenarios: El edge case de backend fallo no esta como AC formal
- [x] Expected results not specific enough: "Ver mensaje 'Sesion expirada'" sin texto exacto
- [ ] Acceptance criteria are vague or subjective
- [ ] Missing test data examples
- [ ] Missing performance criteria
- [ ] Cannot be tested in isolation

**Recommendations to Improve Testability:**

1. Mover el "resilient logout" de Notes a AC como Scenario 5
2. Especificar texto exacto del mensaje de sesion expirada
3. Confirmar si el toast de "Sesion cerrada" es AC o nice-to-have
4. Agregar AC sobre comportamiento multi-tab (aunque sea para documentar la "known limitation")

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Logout exitoso desde dashboard (Happy Path)

**Type:** Positive
**Priority:** Critical

- **Given:**
  - Usuario autenticado con sesion activa (cookies `access_token` y `refresh_token` presentes)
  - TanStack Query tiene datos cacheados del usuario
  - Usuario en cualquier pagina del dashboard

- **When:**
  - Usuario hace clic en el boton "Cerrar sesion" (data-testid: `logout-button`)

- **Then:**
  - `POST /api/auth/logout` es invocado exitosamente
  - API retorna `{"success": true, "data": {"message": "Sesion cerrada exitosamente"}}` — Status 200
  - `supabase.auth.signOut()` es llamado y la sesion queda invalidada en Supabase
  - Cookie `access_token` eliminada (`Set-Cookie: access_token=; Max-Age=0; HttpOnly; Secure; Path=/`)
  - Cookie `refresh_token` eliminada (`Set-Cookie: refresh_token=; Max-Age=0; HttpOnly; Secure; Path=/`)
  - `queryClient.clear()` es invocado (TanStack Query cache vaciado)
  - Usuario redirigido a `/login`

---

### Scenario 2: Rutas protegidas bloqueadas post-logout

**Type:** Security
**Priority:** Critical

- **Given:**
  - Usuario acaba de completar logout exitosamente
  - No hay cookies validas en el browser

- **When:**
  - Usuario intenta acceder a `/dashboard` directamente via URL

- **Then:**
  - Auth middleware detecta ausencia de JWT valido
  - Redirect a `/login`
  - No se visualiza ningun dato del usuario anterior (sin flash de contenido)
  - No se retorna ningun dato de la API (ningun request a API sin auth)

---

### Scenario 3: Logout desde dropdown menu de usuario

**Type:** Positive
**Priority:** High

- **Given:**
  - Usuario autenticado en el dashboard
  - Header visible con avatar/nombre del usuario

- **When:**
  - Usuario hace clic en su avatar/nombre (data-testid: `user-menu`) → dropdown aparece
  - Usuario hace clic en "Cerrar sesion" en el dropdown (data-testid: `user-menu-logout`)

- **Then:**
  - Identico resultado al Scenario 1 (full logout process)

---

### Scenario 4: Auto-logout cuando sesion expira completamente (access + refresh token expirados)

**Type:** Edge Case
**Priority:** High

- **Given:**
  - El access token del usuario ha expirado (mas de 1 hora)
  - El refresh token tambien ha expirado o es invalido

- **When:**
  - Usuario intenta realizar cualquier accion protegida

- **Then:**
  - El middleware detecta access token expirado
  - Intenta refresh con el refresh token → falla (401 de Supabase)
  - Cookies `access_token` y `refresh_token` eliminadas del cliente
  - Usuario redirigido a `/login`
  - Mensaje visible: "Sesion expirada. Por favor inicia sesion nuevamente"

---

### Scenario 5: Logout resiliente cuando el backend falla [NUEVO - QA Analysis]

**Type:** Edge Case
**Priority:** High
**Source:** Identified during critical analysis (Technical Notes)

- **Given:**
  - Usuario autenticado con sesion activa
  - El API call a `POST /api/auth/logout` falla (network error, 500, o timeout)

- **When:**
  - Usuario hace clic en "Cerrar sesion"
  - La llamada al backend falla

- **Then:**
  - Cookies locales (`access_token`, `refresh_token`) son eliminadas de todas formas
  - TanStack Query cache es limpiado
  - Usuario redirigido a `/login`
  - **⚠️ NOTE:** Este behavior esta en Technical Notes pero NO en los AC originales — **NECESITA CONFIRMACION DEL DEV TEAM**

---

### Scenario 6: Auto-refresh exitoso cuando access expira pero refresh es valido

**Type:** Edge Case
**Priority:** Medium

- **Given:**
  - Usuario autenticado con access token expirado (mas de 1 hora)
  - Refresh token aun es valido (dentro de los 7 dias)

- **When:**
  - Usuario intenta realizar cualquier accion protegida

- **Then:**
  - Auth middleware detecta access token expirado
  - Sistema usa refresh token automaticamente para obtener nuevo access token
  - Nueva cookie `access_token` seteada con nueva TTL de 1 hora
  - Usuario continua usando la app sin interrupcion (sin redirect a login)

---

## 🧪 Paso 4: Test Design

### Test Coverage Analysis

**Total Test Cases Needed:** 8

**Breakdown:**

- Positive: 2 test cases
- Security: 3 test cases
- Boundary: 0 test cases
- Edge Case: 2 test cases
- API: 1 test case

**Rationale for This Number:**
Alineado con el estimate del Feature Test Plan del epic (8 TCs para FIN-4). La story es de complejidad Low-Medium funcional pero Medium-High en seguridad. No hay validaciones de datos de entrada que requieran tests de boundary. Los tests de seguridad (cookies, cache, rutas protegidas) son los mas criticos y ameritan test cases individuales.

---

### Parametrization Opportunities

**Parametrized Tests Recommended:** ❌ No

Los escenarios de logout son suficientemente distintos en contexto, precondiciones y resultados esperados que no comparten un patron comun parametrizable. Cada test verifica un aspecto diferente de la limpieza de sesion.

---

### Test Outlines

#### TC-1: Validar logout exitoso con redireccion a login desde dashboard

**Related Scenario:** Scenario 1
**Type:** Positive
**Priority:** Critical
**Test Level:** E2E
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario registrado con sesion activa (cookies `access_token` + `refresh_token` presentes)
- Usuario en `/dashboard`
- TanStack Query con al menos 1 query cacheada

---

**Test Steps:**

1. Navegar a `/dashboard` como usuario autenticado
   - **Verify:** Dashboard carga exitosamente con datos del usuario
2. Localizar el boton de logout (data-testid: `logout-button`)
   - **Verify:** Boton visible en el header o sidebar
3. Hacer clic en "Cerrar sesion"
   - **Verify:** Request `POST /api/auth/logout` enviado (Network tab)
4. Verificar la respuesta del servidor
   - **Verify:** Status 200, response body correcto
5. Verificar cookies despues del redirect
   - **Verify:** `access_token` ausente, `refresh_token` ausente en DevTools > Application > Cookies

---

**Expected Result:**

- **UI:** Usuario redirigido a `/login`. Pagina de login carga correctamente.
- **API Response:**
  - Status Code: 200 OK
  - Response Body:
    ```json
    {
      "success": true,
      "data": {
        "message": "Sesion cerrada exitosamente"
      }
    }
    ```
- **Cookies:** `access_token` y `refresh_token` eliminadas
- **System State:** Sesion invalidada en Supabase Auth

---

**Test Data:**

```json
{
  "user": {
    "email": "valentina.test@finora.app",
    "password": "SecurePass123"
  },
  "start_url": "/dashboard"
}
```

---

**Post-conditions:**

- Usuario en `/login` sin sesion activa
- Cookies de sesion eliminadas del browser
- TanStack Query cache vaciado

---

#### TC-2: Validar logout exitoso desde dropdown menu de usuario

**Related Scenario:** Scenario 3
**Type:** Positive
**Priority:** High
**Test Level:** UI
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario autenticado con sesion activa
- Header visible con avatar/nombre del usuario (data-testid: `user-menu`)

---

**Test Steps:**

1. Navegar a cualquier pagina del dashboard
2. Hacer clic en el avatar/nombre en el header (data-testid: `user-menu`)
   - **Verify:** Dropdown menu aparece con opciones del usuario
3. Localizar la opcion "Cerrar sesion" en el dropdown (data-testid: `user-menu-logout`)
   - **Verify:** La opcion "Cerrar sesion" es visible y accesible
4. Hacer clic en "Cerrar sesion"
   - **Verify:** Proceso de logout iniciado

---

**Expected Result:**

- **UI:** Dropdown se cierra, logout ejecutado, usuario redirigido a `/login`
- **Cookies:** `access_token` y `refresh_token` eliminadas
- **System State:** Identico al resultado de TC-1

---

**Test Data:**

```json
{
  "user": {
    "email": "valentina.test@finora.app",
    "password": "SecurePass123"
  }
}
```

---

**Post-conditions:**

- Usuario en `/login`
- Cookies de sesion eliminadas

---

#### TC-3: Validar eliminacion de cookies HTTP-only post-logout

**Related Scenario:** Scenario 2 (security validation)
**Type:** Security
**Priority:** Critical
**Test Level:** API
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario autenticado con cookies `access_token` y `refresh_token` (HTTP-only) presentes
- Acceso a DevTools para inspeccionar cookies

---

**Test Steps:**

1. Verificar que `access_token` y `refresh_token` existen pre-logout
   - **Verify:** Ambas cookies presentes en DevTools > Application > Cookies
2. Ejecutar `POST /api/auth/logout` (via Postman o directamente)
   - **Data:** Include session cookies en request
3. Inspeccionar los response headers
   - **Verify:** `Set-Cookie: access_token=; Max-Age=0; HttpOnly; Secure; Path=/` presente
   - **Verify:** `Set-Cookie: refresh_token=; Max-Age=0; HttpOnly; Secure; Path=/` presente
4. Intentar usar el access_token anterior para acceder a endpoint protegido
   - **Data:** `GET /api/auth/profile` con el access_token antiguo
   - **Verify:** Recibe 401 Unauthorized

---

**Expected Result:**

- **API Response logout:** 200 OK con headers eliminando ambas cookies
- **Cookies post-logout:** Ninguna cookie de sesion presente en el browser
- **Access con token antiguo:** 401 `{"success": false, "error": {"code": "UNAUTHORIZED", "message": "No hay sesion activa"}}`
- **Database:** Sesion invalidada en Supabase Auth

---

**Test Data:**

```json
{
  "endpoint": "POST /api/auth/logout",
  "headers": {
    "Cookie": "access_token=<valid_jwt>; refresh_token=<valid_refresh>"
  }
}
```

---

**Post-conditions:**

- Cookies eliminadas del browser
- Token anterior ya no puede ser reutilizado

---

#### TC-4: Validar limpieza del TanStack Query cache post-logout

**Related Scenario:** Scenario 1 (implicit requirement from Technical Notes)
**Type:** Security
**Priority:** High
**Test Level:** Integration
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario autenticado con datos cacheados en TanStack Query (dashboard data, profile, etc.)
- React DevTools con TanStack Query tab disponible

---

**Test Steps:**

1. Navegar al dashboard y confirmar queries cacheadas
   - **Verify:** En React DevTools (TanStack Query tab), hay queries con datos
2. Ejecutar logout completo
3. Inmediatamente post-redirect a `/login`, verificar estado del cache
   - **Verify:** TanStack Query cache vacio (0 queries cacheadas)
4. (Critico) Navegar al dashboard via URL
   - **Verify:** Redirect inmediato a `/login`, sin flash de contenido anterior

---

**Expected Result:**

- **Cache State Post-logout:** `queryClient.getQueryCache().getAll().length === 0`
- **UI:** Al intentar acceder al dashboard, no hay flash de contenido anterior antes del redirect
- **Security:** Ningun dato financiero del usuario queda en memoria accesible del cliente

---

**Test Data:**

```json
{
  "user": {
    "email": "valentina.test@finora.app",
    "password": "SecurePass123"
  },
  "verification_tool": "React DevTools (TanStack Query tab)"
}
```

---

**Post-conditions:**

- Cache de TanStack Query vacio
- No hay datos del usuario accesibles en client-side

---

#### TC-5: Validar bloqueo de rutas protegidas despues del logout

**Related Scenario:** Scenario 2
**Type:** Security
**Priority:** Critical
**Test Level:** E2E
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario acaba de hacer logout (sin cookies validas)
- El browser tiene en historial la URL del dashboard

---

**Test Steps:**

1. Completar logout desde el dashboard
2. Esperar redirect a `/login`
3. Intentar navegar a `/dashboard` via URL bar
4. Intentar navegar a `/transactions` via URL bar
5. Intentar navegar a `/goals` via URL bar
6. Usar browser back button para intentar volver al dashboard
   - **Verify:** En todos los casos, redirect a `/login`

---

**Expected Result:**

- **Rutas protegidas:** Todas redirigen a `/login`
- **Browser history back:** Back button tambien lleva a `/login` (no al dashboard pre-logout)
- **No data leak:** Las paginas del dashboard NO son visibles ni por un instante (sin "flash" de contenido)

---

**Test Data:**

```json
{
  "protected_routes": ["/dashboard", "/transactions", "/debts", "/goals", "/subscriptions"],
  "expected_redirect": "/login"
}
```

---

**Post-conditions:**

- Confirmacion de que todas las rutas protegidas estan correctamente aseguradas post-logout

---

#### TC-6: Validar auto-logout y mensaje cuando sesion expira completamente

**Related Scenario:** Scenario 4
**Type:** Edge Case
**Priority:** High
**Test Level:** E2E
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario con access token expirado Y refresh token expirado/invalido
- (Para testing: manipular tokens en DevTools o usar tokens de TTL corta en staging)

---

**Test Steps:**

1. Forzar expiracion de access token y refresh token
   - **Data:** Manipular `access_token` y `refresh_token` en DevTools a valores expirados (JWT con `exp` en el pasado)
2. Intentar realizar cualquier accion protegida (clic en cualquier elemento del dashboard)
3. Observar el comportamiento del sistema

---

**Expected Result:**

- **UI:** Mensaje visible: "Sesion expirada. Por favor inicia sesion nuevamente"
- **Cookies:** `access_token` y `refresh_token` eliminadas
- **Redirect:** Usuario redirigido a `/login`
- **API:** Supabase devuelve 401 al intentar refresh → cliente ejecuta logout defensivo

---

**Test Data:**

```json
{
  "scenario": "Manipular access_token y refresh_token en DevTools para valores expirados",
  "expected_message": "Sesion expirada. Por favor inicia sesion nuevamente",
  "alternative": "Usar staging con tokens de TTL configurada en 10 segundos"
}
```

---

**Post-conditions:**

- Usuario en `/login` con mensaje de sesion expirada visible
- No hay cookies de sesion activas

---

#### TC-7: Validar logout resiliente cuando el backend falla

**Related Scenario:** Scenario 5 (Edge Case — NOT in original AC)
**Type:** Edge Case
**Priority:** High
**Test Level:** Integration
**Parametrized:** ❌ No

> **⚠️ PREREQUISITO:** Confirmar con Dev que el resilient logout esta implementado (segun Technical Notes). Si no, este TC es un bug report, no un test case.

---

**Preconditions:**

- Usuario autenticado con sesion activa
- Se puede simular fallo del backend (DevTools Network block o proxy retornando 500)

---

**Test Steps:**

1. Simular fallo del backend: En DevTools Network, bloquear requests a `/api/auth/logout`
2. Hacer clic en "Cerrar sesion"
3. Observar el comportamiento del frontend

---

**Expected Result:**

- **Cookies:** `access_token` y `refresh_token` eliminadas localmente (incluso si API falla)
- **TanStack Query:** Cache limpiado
- **Redirect:** Usuario redirigido a `/login`
- **UI:** _(A confirmar con Dev)_ ¿Se muestra algun mensaje de error al usuario?

---

**Test Data:**

```json
{
  "simulation": "DevTools Network: bloquear /api/auth/logout o retornar 500",
  "expected_behavior": "Defensive logout: limpiar cookies localmente aunque API falle"
}
```

---

**Post-conditions:**

- Cookies eliminadas localmente
- Usuario en `/login`

---

#### TC-8: Validar respuesta API 200 del endpoint POST /api/auth/logout

**Related Scenario:** Scenario 1 (API layer)
**Type:** Positive
**Priority:** High
**Test Level:** API
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario autenticado con JWT valido en las cookies
- Acceso a Postman o herramienta de API testing

---

**Test Steps:**

1. Enviar `POST /api/auth/logout` con cookies de sesion validas
   - **Data:** Include `Cookie: access_token=<valid_jwt>; refresh_token=<valid_refresh>`
2. Verificar response status
3. Verificar response body
4. Verificar response headers (cookie deletion)

---

**Expected Result:**

- **Status Code:** 200 OK
- **Response Body:**

  ```json
  {
    "success": true,
    "data": {
      "message": "Sesion cerrada exitosamente"
    }
  }
  ```

- **Response Headers:**
  - `Set-Cookie: access_token=; Max-Age=0; HttpOnly; Secure; Path=/`
  - `Set-Cookie: refresh_token=; Max-Age=0; HttpOnly; Secure; Path=/`
- **OpenAPI Spec Compliance:** Response matches spec in `api-contracts.yaml`

---

**Test Data:**

```json
{
  "method": "POST",
  "endpoint": "/api/auth/logout",
  "headers": {
    "Cookie": "access_token=<valid_jwt>; refresh_token=<valid_refresh>"
  },
  "expected_status": 200
}
```

---

**Post-conditions:**

- Sesion invalidada en Supabase Auth

---

## 🔗 Integration Test Cases

### Integration Test 1: Frontend → POST /api/auth/logout → Supabase Auth

**Integration Point:** Frontend → Backend API → Supabase Auth
**Type:** Integration
**Priority:** High

**Preconditions:**

- Backend API running
- Supabase Auth accessible
- Usuario con sesion activa

**Test Flow:**

1. Frontend envia `POST /api/auth/logout` con session cookies
2. API Route valida JWT
3. API Route llama `supabase.auth.signOut()`
4. Supabase Auth invalida sesion
5. API Route setea `Set-Cookie` headers para eliminar cookies
6. API retorna 200
7. Frontend llama `queryClient.clear()` y `router.push('/login')`

**Contract Validation:**

- Request format matches OpenAPI spec: ✅ Yes
- Response format matches OpenAPI spec: ✅ Yes
- Status codes match spec: ✅ Yes

**Expected Result:**

- Cierre completo del ciclo de sesion: tokens invalidos en Supabase, cookies eliminadas, estado limpiado
- No hay datos residuales de sesion en ningun punto del stack

---

## 📊 Edge Cases Summary

| Edge Case                        | En Story Original? | En Refined AC?         | Test Case | Priority |
| -------------------------------- | ------------------ | ---------------------- | --------- | -------- |
| Logout con backend fallando      | ❌ Solo en Notes   | ✅ Scenario 5          | TC-7      | High     |
| Comportamiento multi-tab         | ❌ No              | ⚠️ Pendiente PO        | TBD       | High     |
| Double-click en logout           | ❌ No              | Test cases only        | —         | Low      |
| Sesion expirada (access+refresh) | ✅ Scenario 3      | ✅ Scenario 4 refinado | TC-6      | High     |
| Auto-refresh exitoso             | ⚠️ Parcialmente    | ✅ Scenario 6          | N/A\*     | Medium   |

\*El auto-refresh exitoso es el complemento del Scenario 4 y esta validado indirectamente por FIN-3.

---

## 🗂️ Test Data Summary

### Data Categories

| Data Type                  | Count | Purpose         | Examples                                  |
| -------------------------- | ----- | --------------- | ----------------------------------------- |
| Valid user data            | 1     | Positive tests  | valentina.test@finora.app / SecurePass123 |
| Expired tokens             | 1     | Edge case tests | JWT con `exp` en el pasado                |
| Backend failure simulation | 1     | Resilience test | DevTools Network block                    |

### Data Generation Strategy

**Static Test Data:**

- `valentina.test@finora.app` / `SecurePass123` — usuario consistente con Feature Test Plan del epic
- Expired JWT: token con campo `exp` en el pasado (generar en staging con TTL corta o crear custom JWT)

**Dynamic Test Data (Faker.js):**

- No aplica para esta story — logout no requiere inputs de datos del usuario.

**Test Data Cleanup:**

- ✅ Las cookies se limpian como parte del test (el logout las elimina)
- ✅ Tests son idempotentes (multiples runs no afectan la BD)
- ✅ No hay creacion de datos en DB durante el testing de logout

---

## 🎯 Definition of Done (QA Perspective)

Esta story se considera "Done" desde QA cuando:

- [ ] Todos los test cases (8) ejecutados
- [ ] Critical/High test cases: 100% passing
  - [ ] TC-1 (logout exitoso desde dashboard): ✅ Passing
  - [ ] TC-3 (cookies HTTP-only eliminadas): ✅ Passing
  - [ ] TC-5 (rutas protegidas bloqueadas): ✅ Passing
  - [ ] TC-6 (auto-logout sesion expirada): ✅ Passing
  - [ ] TC-7 (resilient logout): ✅ Passing (o confirmado como future work)
- [ ] Preguntas pendientes de PO respondidas (multi-tab, toast)
- [ ] Implementacion del resilient logout confirmada por Dev
- [ ] Texto exacto del mensaje de sesion expirada confirmado
- [ ] Integration test con Supabase passing
- [ ] Cross-browser: cookies eliminadas correctamente en Chrome, Firefox, Safari (iOS Safari P0)

---

## 📎 Related Documentation

- **Story:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/stories/STORY-FIN-4-user-logout/story.md`
- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **Feature Test Plan:** Jira FIN-1 comment — "Feature Test Plan - Generated 2026-02-24"
- **Business Model:** `.context/idea/business-model.md`
- **PRD:** `.context/PRD/` (all files)
- **SRS:** `.context/SRS/` (all files)
- **Architecture:** `.context/SRS/architecture-specs.md`
- **API Contracts:** `.context/SRS/api-contracts.yaml`

---

## 📋 Test Execution Tracking

[Esta seccion se completa durante ejecucion]

**Test Execution Date:** TBD
**Environment:** Staging
**Executed By:** TBD

**Results:**

- Total Tests: 8
- Passed: TBD
- Failed: TBD
- Blocked: TBD

**Bugs Found:**

- TBD

**Sign-off:** TBD

---

_Formato: Markdown estructurado siguiendo flujo JIRA-FIRST → LOCAL MIRROR_
_Generado: 2026-02-25 | Branch: test/FIN-4/user-logout_
