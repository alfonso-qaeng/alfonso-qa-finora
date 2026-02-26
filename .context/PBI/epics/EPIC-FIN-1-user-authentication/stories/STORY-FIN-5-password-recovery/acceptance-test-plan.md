# Acceptance Test Plan: STORY-FIN-5 - Recuperacion de Contrasena

**Fecha:** 2026-02-25
**QA Engineer:** Alfonso Hernandez
**Story Jira Key:** FIN-5
**Epic:** EPIC-FIN-1 - Autenticacion y Gestion de Usuario
**Status:** Draft
**Branch:** test/FIN-5/password-recovery

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Andres (Freelancer, 32) — "Early adopter que valora herramientas que funcionan desde dia 1. Un recovery flow roto o tokens que expiran inesperadamente lo decepcionan." Password recovery es su puerta de re-entrada a la app.
- **Secondary:** Carmen (Simplificadora, 38) — "Si tengo que ver un tutorial de YouTube para entender la app, ya la perdi." El flujo de recuperacion debe ser intuitivo y sin friccion.

**Business Value:**

- **Value Proposition:** Sin esta funcionalidad, un usuario que olvida su contrasena pierde acceso permanentemente → churn definitivo. Finora no puede permitirse ese nivel de abandono para un producto cuyo diferenciador es la "simplicidad sin friccion".
- **Business Impact:** KPI directo — Password recovery completion rate > 70% (identificado en Feature Test Plan de FIN-1). Si el flujo falla o confunde, impacta directamente en Retention D30 (target: 25%) y en la metrica de MAU (500 en 3 meses).

**Related User Journey:**

- Journey: Journey 1 - Registro y Primer Gasto (Valentina) — FIN-5 no aparece en los journeys documentados, pero forma parte critica del re-entry flow. Es el "Journey de rehabilitacion de acceso".
- Step: Cuando un usuario regresa despues de olvidar su contrasena, FIN-5 es su unico camino de recuperacion.

---

### Technical Context of This Story

**Architecture Components:**

**Frontend:**

- Components: `ForgotPasswordForm.tsx`, `ResetPasswordForm.tsx`
- Pages/Routes: `/forgot-password` (solicitud), `/reset-password?token=xxx` (reset)
- State Management: React Hook Form + Zod schemas para validacion cliente

**Backend:**

- API Endpoints:
  - `POST /api/auth/forgot-password` — solicitar email de recuperacion
  - `POST /api/auth/reset-password` — ⚠️ NO documentado en api-contracts.yaml (Gap critico)
- Services: `supabase.auth.resetPasswordForEmail()` — Supabase maneja generacion y envio del token
- Database: `auth.users` (Supabase managed) — token almacenado internamente por Supabase

**External Services:**

- Supabase Auth — generacion de token y gestion del TTL (1 hora)
- Supabase Email Service — envio del email con recovery link

**Integration Points:**

- Frontend `/forgot-password` → `POST /api/auth/forgot-password` → `Supabase Auth resetPasswordForEmail()`
- Supabase Auth → Email Service → Email del usuario (link con token)
- Email link (`/reset-password?token=xxx`) → Frontend → `POST /api/auth/reset-password` → Supabase Auth

---

### Story Complexity Analysis

**Overall Complexity:** High

**Complexity Factors:**

- Business logic complexity: Medium — dos flujos separados (solicitud + reset)
- Integration complexity: High — dependencia de Supabase Email Service, token en URL, flujo 2-pasos asincronico
- Data validation complexity: Medium — validacion de token + validacion de nueva password
- UI complexity: Low — dos formularios simples con loading states y feedback

**Estimated Test Effort:** High
**Rationale:** Alta complejidad por ser un flow de 2 pasos con dependencia de servicio externo (email). El mayor riesgo es la integracion con el email service y la validacion del token de uso unico. Testing E2E completo requiere herramienta de email testing (Mailosaur/Mailtrap) aun no configurada.

---

### Epic-Level Context (From Feature Test Plan in Jira FIN-1)

**Critical Risks Already Identified at Epic Level:**

- Risk 1 (Business): "Password Recovery poco confiable" — Impact: High, Likelihood: Medium
  - **Relevance to This Story:** Esta story ES ese riesgo. Si el flujo falla, los usuarios no pueden recuperar su cuenta → churn permanente.
- Risk 2 (Integration): "Supabase Auth ↔ Email Service" — Email no llega, cae en spam, template roto
  - **Relevance to This Story:** FIN-5 es el UNICO story de la epica que activa este integration point.

**Integration Points from Epic Analysis:**

- Supabase Auth ↔ Email Service:
  - **Applies to This Story:** ✅ Yes
  - **How:** El email service es esencial para el Scenario 1 (happy path completo).

**Critical Questions Already Asked at Epic Level:**

- Missing 1: "Endpoint POST /api/auth/reset-password no documentado en api-contracts.yaml"
  - **Status:** ⏳ Pending
  - **Impact on This Story:** Sin el contrato, no podemos definir el request exacto. ¿El token va en el body o lo maneja Supabase via sesion activa del link?

- Missing 2: "Estrategia de testing para email delivery"
  - **Status:** ⏳ Pending
  - **Impact on This Story:** Sin Mailosaur, Scenarios 1 y 3 solo tienen cobertura parcial (hasta API response, no verificacion del email).

**Test Strategy from Epic:**

- Test Levels: Unit (Zod schemas), Integration (forgot-password → Supabase), E2E (Playwright), API (Postman/Newman)
- Tools: Playwright (E2E), Postman/Newman (API), Mailosaur (email testing — pendiente setup)
- **How This Story Aligns:** Todos los niveles aplican. Integration y E2E son los mas criticos por el flow 2-pasos.

**Summary: How This Story Fits in Epic:**

- **Story Role in Epic:** FIN-5 es el unico story con dependencia de servicio externo de email. Es el mas complejo desde perspectiva de integration testing en toda la epica.
- **Inherited Risks:** Supabase SPOF, Integration Risk 2 (email delivery)
- **Unique Considerations:** Token de uso unico, mensaje generico anti-enumeration, flujo asincronico 2-pasos

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

**Ambiguity 1:** Discrepancia entre story.md (6 scenarios) y version Jira original (4 scenarios)

- **Location in Story:** Acceptance Criteria
- **Question for PO:** ¿Los 6 scenarios del story.md son los definitivos? La version de Jira original omitia Scenario 2 (email no registrado — anti-enumeration) y Scenario 6 (password < 8 chars). Estos fueron agregados en el refinamiento (Paso 5).
- **Impact on Testing:** Si Scenario 2 no esta en AC, Dev podria retornar 404 para emails no registrados → vulnerabilidad de user enumeration.
- **Suggested Clarification:** Alineado en Jira en Paso 5. Confirmar con PO.

**Ambiguity 2:** Mecanismo de envio del token al backend en reset-password

- **Location in Story:** Technical Notes (Backend)
- **Question for Dev:** El request documentado es `{"password": "NewSecurePass456"}` sin token. ¿El frontend extrae el token de la URL y lo incluye en el body? ¿O Supabase establece una sesion temporal al abrir el link y el backend usa esa sesion?
- **Impact on Testing:** Define el contrato exacto del API de reset-password.
- **Suggested Clarification:** Documentar request body completo en api-contracts.yaml.

**Ambiguity 3:** Comportamiento al solicitar 2do reset mientras el primero esta vigente

- **Location in Story:** No mencionado
- **Question for Dev:** Si el usuario solicita recovery, no usa el link, y solicita de nuevo — ¿el primer token se invalida?
- **Impact on Testing:** Si coexisten tokens validos, hay un security gap potencial.
- **Suggested Clarification:** Agregar AC: "Al solicitar un nuevo reset, cualquier token anterior para el mismo email queda invalidado."

---

### Missing Information / Gaps

**Gap 1:** Endpoint `POST /api/auth/reset-password` no documentado en api-contracts.yaml

- **Type:** Technical Details / API Contract
- **Why It's Critical:** Sin el contrato, no podemos escribir tests de API ni validar el schema de request/response.
- **Suggested Addition:**
  ```yaml
  POST /api/auth/reset-password:
    request: { password: string (min 8 chars) }
    responses:
      200: { success: true, message: "Contraseña actualizada exitosamente" }
      400: { success: false, error: { code: "TOKEN_EXPIRED|TOKEN_INVALID", message: string } }
      400: { success: false, error: { code: "WEAK_PASSWORD", message: string } }
  ```
- **Impact if Not Added:** API testing de FIN-5 no puede validar el contrato.

**Gap 2:** AC de confirmacion de contrasena — falta en story original

- **Type:** Acceptance Criteria
- **Why It's Critical:** data-testid `reset-password-confirm` definido pero sin AC de validacion.
- **Suggested Addition:** Scenario: "Given token valido, When ingreso contrasenas diferentes, Then veo 'Las contrasenas no coinciden' y submit deshabilitado."
- **Impact if Not Added:** Dev podria no implementar la validacion → UX deficiente.

**Gap 3:** Herramienta de email testing para staging

- **Type:** Technical Details / Test Infrastructure
- **Why It's Critical:** Sin Mailosaur/Mailtrap, los Scenarios 1 y 3 no tienen cobertura E2E completa.
- **Suggested Addition:** Setup Mailosaur antes de testing de FIN-5.
- **Impact if Not Added:** Coverage incompleta para el happy path mas critico.

---

### Edge Cases NOT Covered in Original Story

**Edge Case 1:** Token de uso unico — reutilizacion del mismo link

- **Scenario:** Usuario resetea contrasena → intenta usar el MISMO link nuevamente
- **Expected Behavior:** Error de token invalido — token debe ser invalidado post-primer-uso
- **Criticality:** High — security gap si tokens son reutilizables
- **Action Required:** Add to story + TC-007

**Edge Case 2:** Confirmacion de contrasena no coincide

- **Scenario:** Passwords diferentes en "nueva" y "confirmar"
- **Expected Behavior:** Error "Las contrasenas no coinciden", submit deshabilitado
- **Criticality:** High — UX critica
- **Action Required:** Add to story (Gap 2) + TC-012

**Edge Case 3:** Acceso al link de recuperacion con sesion activa

- **Scenario:** Usuario logueado abre link de recovery
- **Expected Behavior:** ⚠️ Necesita confirmacion PO — opcion A: mostrar reset form; opcion B: redirigir a dashboard
- **Criticality:** Medium
- **Action Required:** Ask PO

**Edge Case 4:** 2do reset antes de expirar el primero

- **Scenario:** Usuario solicita recovery, no usa el link, solicita uno nuevo
- **Expected Behavior:** Nuevo token valido, anterior invalidado
- **Criticality:** High — security
- **Action Required:** Ask Dev sobre comportamiento de Supabase Auth

---

### Testability Validation

**Is this story testeable as written?** ⚠️ Partially

**Testability Issues:**

- [x] Missing test data examples (token values, formato del link en email)
- [x] Cannot be tested in isolation (dependencia: Supabase Email Service, email testing tool)
- [x] Missing error scenarios (confirmacion de contrasena, token reutilizado)

**Recommendations:**

1. Configurar Mailosaur antes de testing de FIN-5
2. Documentar endpoint reset-password en api-contracts.yaml
3. Confirmar mecanismo del token en el request body

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Solicitar email de recuperacion con email registrado (Happy Path)

**Type:** Positive
**Priority:** Critical

- **Given:**
  - Usuario `andres.test@finora.app` tiene cuenta registrada en Finora
  - Usuario esta en la pagina `/login`

- **When:**
  - Usuario hace clic en el link "¿Olvidaste tu contrasena?"
  - Usuario llega a `/forgot-password` con data-testid="forgot-password-form" visible
  - Usuario ingresa `andres.test@finora.app` en data-testid="forgot-password-email"
  - Usuario hace clic en data-testid="forgot-password-submit"

- **Then:**
  - data-testid="forgot-password-success" visible con texto: "Si el email existe, recibiras instrucciones"
  - `POST /api/auth/forgot-password` retorna 200
  - Email enviado a `andres.test@finora.app` (verificable via Mailosaur)
  - Email contiene asunto "Recupera tu contrasena de Finora"
  - Email contiene link de recuperacion con token valido por 1 hora
  - Status Code: 200 OK

---

### Scenario 2: Solicitar recuperacion con email no registrado — mensaje generico (Security)

**Type:** Security / Negative
**Priority:** Critical

- **Given:**
  - Usuario esta en `/forgot-password`

- **When:**
  - Usuario ingresa `nonexistent@finora.app` (no registrado)
  - Usuario hace clic en data-testid="forgot-password-submit"

- **Then:**
  - UI muestra el MISMO mensaje "Si el email existe, recibiras instrucciones" — identico al Scenario 1
  - `POST /api/auth/forgot-password` retorna 200 (NO 404 — anti-enumeration)
  - NINGUN email es enviado
  - No hay indicacion de que el email no existe
  - Status Code: 200 OK

---

### Scenario 3: Resetear contrasena con token valido (Happy Path)

**Type:** Positive
**Priority:** Critical

- **Given:**
  - Usuario `andres.test@finora.app` recibio email de recuperacion hace menos de 1 hora
  - El link contiene token valido `?token=<valid_token>`

- **When:**
  - Usuario abre `/reset-password?token=<valid_token>` con data-testid="reset-password-form" visible
  - Usuario ingresa `NewSecurePass456` en data-testid="reset-password-new"
  - Usuario ingresa `NewSecurePass456` en data-testid="reset-password-confirm"
  - Usuario hace clic en data-testid="reset-password-submit"

- **Then:**
  - Contrasena actualizada en Supabase Auth
  - UI muestra "Contrasena actualizada exitosamente"
  - Usuario redirigido a `/login`
  - Login con `NewSecurePass456` es exitoso
  - Login con contrasena anterior `FreelancePass456` falla
  - `POST /api/auth/reset-password` retorna 200

---

### Scenario 4: Token de recuperacion expirado (Error Case)

**Type:** Negative
**Priority:** High

- **Given:**
  - Token generado hace mas de 1 hora

- **When:**
  - Usuario abre `/reset-password?token=<expired_token>`

- **Then:**
  - UI muestra "Este enlace ha expirado"
  - UI muestra CTA para solicitar nuevo email
  - No se puede cambiar la contrasena
  - `POST /api/auth/reset-password` retorna 400 con `{"success": false, "error": {"code": "TOKEN_EXPIRED", "message": "Este enlace ha expirado"}}`

---

### Scenario 5: Rate limiting — 4ta solicitud bloqueada (Security)

**Type:** Security / Boundary
**Priority:** High

- **Given:**
  - Usuario hizo 3 solicitudes de recuperacion en la ultima hora para el mismo email

- **When:**
  - Usuario intenta hacer la 4ta solicitud

- **Then:**
  - UI muestra "Demasiadas solicitudes. Intenta mas tarde"
  - `POST /api/auth/forgot-password` retorna 429
  - Solicitud NO procesada (no se envia email)

---

### Scenario 6: Nueva contrasena no cumple longitud minima (Validation)

**Type:** Negative
**Priority:** High

- **Given:**
  - Usuario esta en `/reset-password` con token valido

- **When:**
  - Usuario ingresa `abc123` (6 caracteres) en data-testid="reset-password-new"

- **Then:**
  - Error inline: "La contrasena debe tener al menos 8 caracteres"
  - data-testid="reset-password-submit" deshabilitado
  - Sin llamada a la API (validacion client-side con Zod)

---

### Scenario 7: Token de uso unico — reutilizacion bloqueada (Security — Edge Case)

**Type:** Security / Edge Case
**Priority:** High
**Source:** Identified during critical analysis (Paso 2)

- **Given:**
  - Usuario uso exitosamente el link de recuperacion y cambio su contrasena

- **When:**
  - Usuario intenta abrir el MISMO link nuevamente

- **Then:**
  - UI muestra error de link invalido o ya utilizado
  - `POST /api/auth/reset-password` retorna 400 con error de token invalido
  - Contrasena NO cambiada con el token ya usado
  - **⚠️ NOTE:** Mensaje exacto necesita confirmacion Dev (Supabase puede retornar TOKEN_EXPIRED o TOKEN_INVALID)

---

### Scenario 8: Confirmacion de contrasena no coincide (Validation — Gap)

**Type:** Negative
**Priority:** High
**Source:** Gap identified — falta en story original

- **Given:**
  - Usuario esta en `/reset-password` con token valido

- **When:**
  - Usuario ingresa `NewSecurePass456` en data-testid="reset-password-new"
  - Usuario ingresa `DifferentPass789` en data-testid="reset-password-confirm"

- **Then:**
  - Error: "Las contrasenas no coinciden"
  - data-testid="reset-password-submit" deshabilitado
  - Sin llamada a la API (validacion client-side)
  - **⚠️ NOTE:** No esta en el AC original — necesita confirmacion PO/Dev

---

## 🧪 Paso 4: Test Design

### Test Coverage Analysis

**Total Test Cases Needed:** 12

**Breakdown:**

- Positive: 2 test cases (TC-001, TC-002)
- Negative: 3 test cases (TC-003, TC-004, TC-005)
- Security: 3 test cases (TC-006, TC-007, TC-008)
- API Contract: 3 test cases (TC-009, TC-010, TC-011)
- Edge Case: 1 test case (TC-012)

**Rationale:** 12 TCs es consistente con la estimacion del Feature Test Plan del epic (FIN-5: 12 TCs). Alta complejidad por flujo 2-pasos con email service externo. Los TCs de seguridad son criticos para prevenir user enumeration y reutilizacion de tokens.

---

### Parametrization Opportunities

**Parametrized Tests Recommended:** ❌ No

**Rationale:** Los scenarios son suficientemente distintos en precondiciones y expected results. No hay un patron comun que justifique parametrizacion. Los 2 endpoints tienen comportamientos bien diferenciados.

---

### Test Outlines

#### TC-001: Validar solicitud de recuperacion exitosa con email registrado

**Related Scenario:** Scenario 1
**Type:** Positive
**Priority:** Critical
**Test Level:** E2E / API
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario `andres.test@finora.app` / `FreelancePass456` existe en sistema
- Mailosaur configurado para capturar emails de staging ⚠️
- Usuario esta en `/login`

**Test Steps:**

1. Navegar a `/login`
2. Hacer clic en el link "¿Olvidaste tu contrasena?"
   - **Verify:** URL es `/forgot-password`, data-testid="forgot-password-form" visible
3. Ingresar en data-testid="forgot-password-email": `andres.test@finora.app`
4. Hacer clic en data-testid="forgot-password-submit"
   - **Verify:** data-testid="forgot-password-success" visible con texto "Si el email existe, recibiras instrucciones"
5. Verificar en Mailosaur que email fue recibido
   - **Verify:** Asunto "Recupera tu contrasena de Finora"
   - **Verify:** Email contiene link con token de recuperacion

**Expected Result:**

- **UI:** data-testid="forgot-password-success" con mensaje correcto, sin errores
- **API Response:**
  - Status Code: 200 OK
  - Response Body: `{"success": true, "data": {"message": "Si el email existe, recibiras instrucciones"}}`
- **Email:** Recibido en Mailosaur con link valido

**Test Data:**

```json
{
  "input": { "email": "andres.test@finora.app" },
  "user": { "email": "andres.test@finora.app", "password": "FreelancePass456" }
}
```

**Post-conditions:** Email enviado, token vigente por 1 hora

---

#### TC-002: Validar reset de contrasena exitoso con token valido

**Related Scenario:** Scenario 3
**Type:** Positive
**Priority:** Critical
**Test Level:** E2E / API
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario `andres.test@finora.app` existe en sistema
- Token de recuperacion valido obtenido via TC-001 o Mailosaur
- Token tiene menos de 1 hora desde su generacion

**Test Steps:**

1. Abrir `/reset-password?token=<valid_token>`
   - **Verify:** data-testid="reset-password-form" visible
2. Ingresar en data-testid="reset-password-new": `NewSecurePass456`
3. Ingresar en data-testid="reset-password-confirm": `NewSecurePass456`
4. Hacer clic en data-testid="reset-password-submit"
   - **Verify:** Mensaje "Contrasena actualizada exitosamente" visible
   - **Verify:** Redireccion a `/login`
5. Intentar login con nueva contrasena `NewSecurePass456`
   - **Verify:** Login exitoso, acceso al dashboard
6. Intentar login con contrasena anterior `FreelancePass456`
   - **Verify:** Login falla (credenciales invalidas)

**Expected Result:**

- **UI:** Mensaje exito + redirect a /login
- **API Response:**
  - Status Code: 200 OK
  - Response Body: `{"success": true, "message": "Contrasena actualizada exitosamente"}`
- **Database:** Password hash de `andres.test@finora.app` actualizado en `auth.users`

**Test Data:**

```json
{
  "input": {
    "token": "<valid_token_from_email>",
    "password": "NewSecurePass456",
    "confirm_password": "NewSecurePass456"
  },
  "user": { "email": "andres.test@finora.app", "old_password": "FreelancePass456" }
}
```

**Post-conditions:** Contrasena cambiada. Cleanup: restaurar contrasena original o eliminar usuario de test.

---

#### TC-003: Validar mensaje generico al solicitar recuperacion con email no registrado

**Related Scenario:** Scenario 2
**Type:** Security / Negative
**Priority:** Critical
**Test Level:** API / UI
**Parametrized:** ❌ No

---

**Preconditions:**

- Email `phantom.user.test99@finora.app` NO existe en sistema
- Usuario esta en `/forgot-password`

**Test Steps:**

1. Ingresar en data-testid="forgot-password-email": `phantom.user.test99@finora.app`
2. Hacer clic en data-testid="forgot-password-submit"
   - **Verify:** data-testid="forgot-password-success" con texto IDENTICO al caso exitoso
3. Verificar en Mailosaur que NO se recibio ningun email

**Expected Result:**

- **UI:** Mismo mensaje "Si el email existe, recibiras instrucciones" — IDENTICO al Scenario 1
- **API Response:**
  - Status Code: 200 OK (NO 404 — anti-enumeration)
  - Response Body: `{"success": true, "data": {"message": "Si el email existe, recibiras instrucciones"}}`
- **Email:** NINGUN email enviado (ausencia verificada en Mailosaur)

**Test Data:**

```json
{
  "input": { "email": "phantom.user.test99@finora.app" }
}
```

---

#### TC-004: Validar error al usar token de recuperacion expirado

**Related Scenario:** Scenario 4
**Type:** Negative
**Priority:** High
**Test Level:** API / UI
**Parametrized:** ❌ No

---

**Preconditions:**

- Token de recuperacion expirado (generado hace mas de 1 hora)
- ⚠️ Puede requerir manipulacion del token o esperar TTL en staging

**Test Steps:**

1. Abrir `/reset-password?token=<expired_token>`
   - **Verify:** UI muestra mensaje "Este enlace ha expirado"
   - **Verify:** UI muestra CTA para solicitar nuevo link
2. Intentar POST /api/auth/reset-password con token expirado

**Expected Result:**

- **UI:** "Este enlace ha expirado" + boton de nueva solicitud
- **API Response:**
  - Status Code: 400 Bad Request
  - Response Body: `{"success": false, "error": {"code": "TOKEN_EXPIRED", "message": "Este enlace ha expirado"}}`
- **Database:** Contrasena NO cambiada

**Test Data:**

```json
{
  "input": { "token": "<expired_token>", "password": "NewSecurePass456" }
}
```

---

#### TC-005: Validar error cuando nueva contrasena tiene menos de 8 caracteres

**Related Scenario:** Scenario 6
**Type:** Negative
**Priority:** High
**Test Level:** UI (client-side validation)
**Parametrized:** ❌ No

---

**Preconditions:**

- Usuario esta en `/reset-password` con token valido

**Test Steps:**

1. Ingresar en data-testid="reset-password-new": `abc123` (6 caracteres)
   - **Verify:** Error inline: "La contrasena debe tener al menos 8 caracteres"
   - **Verify:** data-testid="reset-password-submit" deshabilitado
2. Verificar ausencia de llamada a la API

**Expected Result:**

- **UI:** Error inline en campo, boton deshabilitado
- **API:** Sin llamada (validacion client-side con Zod)
- **Database:** Sin cambios

**Test Data:**

```json
{
  "valid_token": "<valid_token>",
  "invalid_passwords": [
    { "value": "abc123", "length": 6 },
    { "value": "1234567", "length": 7 },
    { "value": "", "length": 0 }
  ]
}
```

---

#### TC-006: Validar que respuesta API es identica para emails registrados y no registrados (Anti-Enumeration)

**Related Scenario:** Scenarios 1 y 2
**Type:** Security
**Priority:** Critical
**Test Level:** API
**Parametrized:** ❌ No

---

**Preconditions:**

- Email A: `andres.test@finora.app` — registrado
- Email B: `nonexistent.user.123@finora.app` — NO registrado

**Test Steps:**

1. POST /api/auth/forgot-password con email A (registrado)
   - Registrar: status code, response body, response time
2. POST /api/auth/forgot-password con email B (no registrado)
   - Registrar: status code, response body, response time
3. Comparar ambas respuestas

**Expected Result:**

- Ambas respuestas IDENTICAS:
  - Status Code: 200 OK (ambas)
  - Response Body: `{"success": true, "data": {"message": "Si el email existe, recibiras instrucciones"}}` (ambas)
- Response times similares (sin timing attack vector)

**Test Data:**

```json
{
  "registered": "andres.test@finora.app",
  "not_registered": "nonexistent.user.123@finora.app"
}
```

---

#### TC-007: Validar que token es de uso unico — segunda reutilizacion bloqueada

**Related Scenario:** Scenario 7 (Edge Case)
**Type:** Security
**Priority:** High
**Test Level:** API / E2E
**Parametrized:** ❌ No

---

**Preconditions:**

- TC-002 ejecutado exitosamente: contrasena reseteada con token `<used_token>`
- Token `<used_token>` ya fue consumido

**Test Steps:**

1. Intentar abrir `/reset-password?token=<used_token>`
   - **Verify:** UI muestra error de token invalido
2. Intentar POST /api/auth/reset-password con token ya usado
   - **Data:** `{"password": "AnotherPass123", "token": "<used_token>"}`

**Expected Result:**

- **UI:** Mensaje de error de link invalido o expirado
- **API Response:**
  - Status Code: 400 Bad Request
  - Response Body: Error con codigo TOKEN_EXPIRED o TOKEN_INVALID
- **Database:** Contrasena NO cambiada (sigue siendo `NewSecurePass456`)

---

#### TC-008: Validar rate limiting al superar 3 solicitudes por hora

**Related Scenario:** Scenario 5
**Type:** Security / Boundary
**Priority:** High
**Test Level:** API
**Parametrized:** ❌ No

---

**Preconditions:**

- Email de test: `rate.limit.test@finora.app`
- Contador de solicitudes en 0 para este email

**Test Steps:**

1. POST /api/auth/forgot-password con `rate.limit.test@finora.app` — Solicitud #1 → Verify: 200
2. POST /api/auth/forgot-password con `rate.limit.test@finora.app` — Solicitud #2 → Verify: 200
3. POST /api/auth/forgot-password con `rate.limit.test@finora.app` — Solicitud #3 → Verify: 200
4. POST /api/auth/forgot-password con `rate.limit.test@finora.app` — Solicitud #4 → Verify: 429

**Expected Result:**

- Solicitudes 1-3: Status 200 (dentro del limite)
- Solicitud 4: Status 429 Too Many Requests

**Test Data:**

```json
{
  "input": { "email": "rate.limit.test@finora.app" },
  "expected_limit": 3,
  "window": "1 hora"
}
```

---

#### TC-009: Validar contrato API de forgot-password — respuesta 200

**Related Scenario:** Scenario 1
**Type:** API Contract
**Priority:** High
**Test Level:** API
**Parametrized:** ❌ No

---

**Preconditions:**

- `andres.test@finora.app` existe en sistema

**Test Steps:**

1. POST /api/auth/forgot-password
   - Headers: `Content-Type: application/json`
   - Body: `{"email": "andres.test@finora.app"}`
2. Validar response contra esquema esperado

**Expected Result:**

- **API Response:**
  - Status Code: 200 OK
  - Content-Type: application/json
  - Response Body:
    ```json
    {
      "success": true,
      "data": {
        "message": "Si el email existe, recibiras instrucciones"
      }
    }
    ```
  - Response Time: < 300ms (NFR-P-003 Auth Operations)

---

#### TC-010: Validar contrato API de reset-password — respuesta 200

**Related Scenario:** Scenario 3
**Type:** API Contract
**Priority:** High
**Test Level:** API
**Parametrized:** ❌ No

---

**Preconditions:**

- Token valido disponible (menos de 1 hora)
- ⚠️ Request body pendiente de documentacion en api-contracts.yaml

**Test Steps:**

1. POST /api/auth/reset-password
   - Headers: `Content-Type: application/json`
   - Body: `{"password": "NewSecurePass456"}` (confirmar si token va en body o via sesion Supabase)

**Expected Result:**

- **API Response:**
  - Status Code: 200 OK
  - Response Body:
    ```json
    {
      "success": true,
      "message": "Contraseña actualizada exitosamente"
    }
    ```

---

#### TC-011: Validar contrato API de reset-password con token expirado — respuesta 400

**Related Scenario:** Scenario 4
**Type:** API Contract / Negative
**Priority:** High
**Test Level:** API
**Parametrized:** ❌ No

---

**Preconditions:**

- Token expirado disponible

**Test Steps:**

1. POST /api/auth/reset-password con token expirado

**Expected Result:**

- **API Response:**
  - Status Code: 400 Bad Request
  - Response Body:
    ```json
    {
      "success": false,
      "error": {
        "code": "TOKEN_EXPIRED",
        "message": "Este enlace ha expirado"
      }
    }
    ```

---

#### TC-012: Validar error cuando confirmacion de contrasena no coincide

**Related Scenario:** Scenario 8 (Edge Case — Gap en story original)
**Type:** Negative / Edge Case
**Priority:** High
**Test Level:** UI
**Parametrized:** ❌ No
**Note:** ⚠️ Gap en story original — necesita confirmacion PO/Dev antes de ejecutar.

---

**Preconditions:**

- Usuario esta en `/reset-password` con token valido

**Test Steps:**

1. Ingresar en data-testid="reset-password-new": `NewSecurePass456`
2. Ingresar en data-testid="reset-password-confirm": `DifferentPass789`
   - **Verify:** Error "Las contrasenas no coinciden" visible
   - **Verify:** data-testid="reset-password-submit" deshabilitado
3. Verificar que no se hace llamada a la API

**Expected Result:**

- **UI:** Error inline, boton deshabilitado
- **API:** Sin llamada (validacion client-side)

---

## 🔗 Integration Test Cases

### Integration Test 1: Forgot Password → Supabase Auth → Email Service

**Integration Point:** API Route → Supabase Auth → Email Service
**Type:** Integration
**Priority:** High

**Preconditions:**

- Supabase Auth configurado en staging
- Mailosaur configurado para capturar emails ⚠️

**Test Flow:**

1. Frontend envia POST /api/auth/forgot-password con email valido
2. API Route llama `supabase.auth.resetPasswordForEmail(email)`
3. Supabase genera token y lo almacena internamente
4. Supabase Email Service envia email con link de recuperacion
5. Mailosaur captura el email
6. Frontend recibe 200 y muestra mensaje de exito

**Contract Validation:**

- Request format matches spec: ✅ Yes
- Response format matches spec: ✅ Yes
- Email recibido en Mailosaur: ✅ Verificable con tool configurada

**Expected Result:**

- Flow completo sin errores
- Email recibido con link de recuperacion valido
- Token tiene TTL de 1 hora

---

### Integration Test 2: Recovery Link → Token Validation → Password Update

**Integration Point:** URL Token → Supabase Auth → DB update
**Type:** Integration
**Priority:** High

**Mock Strategy:**

- Token generado por Supabase (no mockeable en staging real)
- Test en staging con credenciales reales de prueba

**Test Flow:**

1. Usuario abre link de recuperacion con token en URL params
2. Frontend extrae token de URL
3. Frontend envia POST /api/auth/reset-password con nueva contrasena
4. API Route valida token via Supabase Auth
5. Si valido: Supabase actualiza password hash en `auth.users`
6. API Route retorna 200 + redirect a `/login`

**Expected Result:**

- Password actualizado en `auth.users`
- Token invalidado post-uso (uso unico)
- Usuario puede hacer login con nueva contrasena

---

## 📊 Edge Cases Summary

| Edge Case                      | Covered in Original Story?    | Added to Refined AC?                     | Test Case | Priority |
| ------------------------------ | ----------------------------- | ---------------------------------------- | --------- | -------- |
| Token de uso unico             | ⚠️ En Technical Notes, sin AC | ✅ Yes (Scenario 7)                      | TC-007    | High     |
| Confirmacion no coincide       | ❌ No                         | ✅ Yes (Scenario 8) — pending PO confirm | TC-012    | High     |
| 2do reset invalida el 1ro      | ❌ No                         | ⚠️ Pending Dev confirmation              | TBD       | High     |
| Session activa + recovery link | ❌ No                         | ⚠️ Pending PO confirmation               | TBD       | Medium   |
| Rate limit boundary (3 vs 4)   | ✅ Parcialmente               | ✅ Yes (Scenario 5 refinado)             | TC-008    | High     |

---

## 🗂️ Test Data Summary

### Data Categories

| Data Type                   | Count | Purpose                 | Examples                                                        |
| --------------------------- | ----- | ----------------------- | --------------------------------------------------------------- |
| Valid emails (registered)   | 2     | Positive tests          | andres.test@finora.app                                          |
| Invalid/unregistered emails | 2     | Security/Negative tests | phantom.user.test99@finora.app, nonexistent.user.123@finora.app |
| Valid passwords (new)       | 2     | Reset tests             | NewSecurePass456, UpdatedPass789                                |
| Invalid passwords           | 3     | Negative tests          | abc123 (6c), 1234567 (7c), "" (empty)                           |
| Valid tokens                | 2     | Happy path tests        | Obtenidos via Mailosaur                                         |
| Expired tokens              | 1     | Negative tests          | Token > 1 hora                                                  |
| Used tokens                 | 1     | Security test (TC-007)  | Token post TC-002                                               |

### Data Generation Strategy

**Static Test Data:**

- User Andres: `andres.test@finora.app` / `FreelancePass456` — usuario principal para recovery tests
- Rate limit test: `rate.limit.test@finora.app` — solo para TC-008

**Dynamic Test Data (using Faker.js):**

- Para emails unicos en tests paralelos: `faker.internet.email()`
- Para passwords validas de reset: `faker.internet.password({ length: 12, memorable: false })`

**Test Data Cleanup:**

- ✅ Restaurar contrasena de andres.test@finora.app despues de TC-002
- ✅ Limpiar rate limit counter via Supabase admin API cuando sea posible
- ✅ Tests son idempotentes cuando es posible
- ✅ NO hardcodear tokens (varian por ejecucion)

---

## 📝 Paso 8: Final QA Feedback Report

### Executive Summary

**Story:** FIN-5 — Recuperacion de Contrasena
**Complejidad:** High (confirmando estimacion del epic)
**Total Test Cases Disenados:** 12 (alineado con Feature Test Plan de FIN-1)
**Cobertura:** 8 Scenarios refinados (vs 4 originales en Jira / 6 en story.md local)

### Blockers que impiden testing completo

| Blocker                                          | Responsable | Impacto                                          |
| ------------------------------------------------ | ----------- | ------------------------------------------------ |
| Endpoint reset-password no en api-contracts.yaml | Dev         | Bloquea TC-010, TC-011 y API testing completo    |
| Sin herramienta de email testing (Mailosaur)     | QA/Infra    | Bloquea TC-001 completo, Integration Tests 1 y 2 |

### Preguntas criticas pendientes de respuesta

| Pregunta                                                               | Dirigida a | Impacto en Testing             |
| ---------------------------------------------------------------------- | ---------- | ------------------------------ |
| ¿Como llega el token al request de reset? ¿Body o sesion Supabase?     | Dev        | Define contrato exacto del API |
| ¿El 2do token invalida el primero si se solicita dentro de la ventana? | Dev        | Impacta edge case de seguridad |
| ¿Que pasa si usuario logueado abre link de recovery?                   | PO         | Impacta diseno de TC edge case |

### Que esta bien cubierto

- Anti-enumeration (TC-003, TC-006): Critico para seguridad, bien cubierto
- Rate limiting boundary exacto (TC-008): 3 solicitudes OK, 4ta bloqueada
- Token de uso unico (TC-007): Edge case de seguridad critico
- Happy path completo del flujo 2-pasos (TC-001 + TC-002)

### Next Steps

1. Dev documenta `POST /api/auth/reset-password` en api-contracts.yaml
2. QA configura Mailosaur para staging
3. PO confirma que los 6 scenarios del story.md son los definitivos en Jira
4. Dev confirma comportamiento de Supabase Auth con tokens multiples
5. Una vez respondido: tests pueden ejecutarse con cobertura completa (12/12 TCs)

---

## 📎 Related Documentation

- **Story:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/stories/STORY-FIN-5-password-recovery/story.md`
- **Feature Test Plan:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/feature-test-plan.md`
- **SRS Functional Specs:** `.context/SRS/functional-specs.md` (FR-004)
- **Non-Functional Specs:** `.context/SRS/non-functional-specs.md` (NFR-S-2.7 Rate Limiting, NFR-P-003)
- **Jira Story:** FIN-5
- **Jira Epic:** FIN-1

---

_Acceptance Test Plan generado: 2026-02-25_
_Metodologia: Shift-Left Testing | JIRA-FIRST → LOCAL MIRROR_
_Story: FIN-5 | Epic: FIN-1 | Branch: test/FIN-5/password-recovery_
_Version: 1.0 — Draft_
