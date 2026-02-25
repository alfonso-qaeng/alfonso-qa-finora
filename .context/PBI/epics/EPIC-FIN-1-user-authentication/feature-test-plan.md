# Feature Test Plan: FIN-1 — Autenticacion y Gestion de Usuario

**Fecha:** 2026-02-24
**QA Lead:** AI-Generated (Shift-Left Analysis)
**Epic Jira Key:** FIN-1
**Status:** Draft - Pending Team Review

---

## 📋 Business Context Analysis

### Business Value

Esta épica es la **foundation bloqueante** de todo Finora. Sin autenticación no existe ninguna otra funcionalidad.

**Key Value Proposition:**

- Habilita la "simplicidad radical": registro en segundos, sin fricción, sin conexión bancaria
- Garantiza la seguridad de los datos financieros del usuario (el activo más sensible del producto)

**Success Metrics (KPIs) impactados:**

- Registration completion rate > 90% (KPI directo de FIN-2)
- Login success rate > 98% (KPI directo de FIN-3)
- Password recovery completion rate > 70% (KPI directo de FIN-5)
- Activation Rate: % usuarios con 5+ transacciones en semana 1 — depende 100% de un registro exitoso

**User Impact:**

- **Valentina (Joven Profesional):** Primera experiencia con Finora. Un registro complejo o un login que falla = abandono permanente. Su pain point principal es "las apps son complicadas" — si el auth es frustrante, se va.
- **Andrés (Freelancer):** Early adopter que valora herramientas que "funcionan desde día 1". Un recovery flow roto o tokens que expiran inesperadamente lo decepcionan.
- **Carmen (Simplificadora):** "Si tengo que ver un tutorial de YouTube para entender la app, ya la perdí." El registro/login debe ser auto-explicativo.

**Critical User Journeys:**

- Journey 1: Registro y Primer Gasto (Valentina) — esta épica cubre los Steps 1-4 completos

---

## 🏗️ Technical Architecture Analysis

### Architecture Components Involved

**Frontend:**

- Componentes: `RegisterForm.tsx`, `LoginForm.tsx`, `LogoutButton.tsx`, `ForgotPasswordForm.tsx`, `ResetPasswordForm.tsx`, `ProfileForm.tsx`
- Páginas/rutas: `/register`, `/login`, `/forgot-password`, `/reset-password?token=xxx`, `/settings/profile`
- State: React Hook Form + Zod schemas, TanStack Query (profile GET/PATCH), Zustand (session state)

**Backend:**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password` ⚠️ (NO documentado en api-contracts.yaml — ver Critical Questions)
- `GET /api/auth/profile`
- `PATCH /api/auth/profile`

**Database:**

- `auth.users` — tabla managed de Supabase (no acceso directo)
- `public.profiles` — perfil extendido (name, currency_symbol)
- Trigger `on_auth_user_created` (o API call post-signup) para crear profiles

**External Services:**

- Supabase Auth (autenticación, JWT, sesiones)
- Supabase Email Service (emails de recuperación de contraseña)

### Integration Points (Critical for Testing)

**Internal Integration Points:**

- Frontend ↔ API Routes (Next.js)
- API Routes ↔ Supabase Auth Client
- API Routes ↔ PostgreSQL (tabla profiles vía RLS)
- Middleware JWT ↔ Supabase Auth (validación de tokens)

**External Integration Points:**

- Supabase Auth ↔ Supabase Email Service (recovery emails)

**Data Flow:**

```
User → RegisterForm → POST /api/auth/register → Supabase Auth (signUp)
                                                      ↓
                                            auth.users (created)
                                                      ↓
                                       Trigger/API → public.profiles (created)
                                                      ↓
                                            JWT tokens → HTTP-only cookies
                                                      ↓
                                              Frontend → Dashboard redirect
```

---

## 🚨 Risk Analysis

### Technical Risks

#### Risk 1: Sincronización auth.users → public.profiles

- **Impact:** High
- **Likelihood:** Medium
- **Area Affected:** Backend + Database
- **Mitigation Strategy:**
  - Definir explícitamente si es trigger o API call (ver Critical Questions)
  - Test de integración que verifica la creación del perfil después del signup
  - Si es trigger: testear que el trigger no falla silenciosamente
- **Test Coverage Required:** TC específico que verifica que post-registro existe row en public.profiles

#### Risk 2: Supabase Auth como Single Point of Failure (SPOF)

- **Impact:** High
- **Likelihood:** Low
- **Area Affected:** Toda la aplicación
- **Mitigation Strategy:**
  - Implementar retry logic con exponential backoff (NFR: 3 reintentos)
  - Mostrar mensaje de error amigable en lugar de pantalla rota
  - Smoke test que verifica conectividad a Supabase antes de cada release
- **Test Coverage Required:** Tests con Supabase mockeado para simular downtime

#### Risk 3: Rate Limiting — falsos positivos o bypass

- **Impact:** Medium
- **Likelihood:** Medium
- **Area Affected:** Backend (API Routes)
- **Mitigation Strategy:**
  - Validar que rate limit bloquea en intento N+1 exacto (no N-1 ni N+2)
  - Validar que el contador se resetea correctamente después de la ventana
  - Validar que usuarios legítimos no quedan bloqueados por IPs compartidas (VPN, oficinas)
- **Test Coverage Required:** Tests de boundary en rate limiting (4 intentos OK, 5 bloqueado para login)

#### Risk 4: JWT Token Refresh Flow

- **Impact:** High
- **Likelihood:** Low
- **Area Affected:** Frontend + Backend middleware
- **Mitigation Strategy:**
  - Test E2E que simula access token expirado y verifica renovación con refresh token
  - Test que verifica deslogueo automático cuando refresh token también expira
- **Test Coverage Required:** TC de sesión expirada en FIN-4 (Scenario 3)

---

### Business Risks

#### Risk 1: Fricción en registro → abandono

- **Impact on Business:** Registration completion rate < 90% → miss de KPI → menos MAU
- **Impact on Users:** Valentina y Carmen abandonan en el primer contacto
- **Likelihood:** Medium
- **Mitigation Strategy:**
  - Testing de UX con validación en tiempo real (no solo al submit)
  - Verificar que mensajes de error son claros y accionables (no técnicos)
  - Testing en móvil (Valentina usa iPhone 13 — iOS Safari P0)
- **Acceptance Criteria Validation:** AC cubre happy path pero no valida mensajes de error amigables

#### Risk 2: Password Recovery poco confiable

- **Impact on Business:** Password recovery completion rate < 70% → usuarios pierden acceso → churn
- **Impact on Users:** Andrés y Carmen no pueden recuperar cuenta → abandono definitivo
- **Likelihood:** Medium
- **Mitigation Strategy:**
  - Test E2E del flujo completo incluyendo recepción del email (puede requerir email de prueba real)
  - Verificar que el email no cae en spam en ambientes de staging
- **Acceptance Criteria Validation:** Bien cubierto en FIN-5 (6 scenarios)

---

### Integration Risks

#### Integration Risk 1: Frontend ↔ HTTP-only Cookies (JWT storage)

- **Integration Point:** Frontend ↔ API Routes
- **What Could Go Wrong:** Cookies no se envían correctamente en requests fetch del cliente, CORS issues, SameSite policy en diferentes browsers
- **Impact:** High
- **Mitigation:**
  - Tests cross-browser de que cookies se setean y envían correctamente (Chrome, Firefox, Safari)
  - Verificar configuración SameSite=Strict/Lax en cookies

#### Integration Risk 2: Supabase Auth ↔ Email Service (Recovery)

- **Integration Point:** Supabase Auth → Email Service
- **What Could Go Wrong:** Email no llega, cae en spam, template roto, link expirado al clickear
- **Impact:** Medium
- **Mitigation:**
  - Usar Mailosaur u otro email testing service para capturar emails en staging
  - Test que verifica estructura del email (link presente, texto correcto)

---

## ⚠️ Critical Analysis & Questions for PO/Dev

### Ambiguities Identified

**Ambiguity 1:** Mecanismo de creación de public.profiles post-registro

- **Found in:** FIN-2 Technical Notes
- **Question for Dev:** ¿El perfil se crea via Supabase trigger (on_auth_user_created) o via API call explícita después del signUp? El story dice "Trigger o API", pero la decisión afecta el testing (si es trigger, necesitamos mock del trigger en unit tests; si es API, necesitamos test de atomicidad).
- **Impact if not clarified:** Si el trigger falla silenciosamente, usuarios quedan con cuenta pero sin perfil, causando errores en toda la app.

**Ambiguity 2:** Comportamiento del refresh token como "remember me"

- **Found in:** FIN-3 Notes
- **Question for PO:** El refresh token dura 7 días. ¿Es este el mecanismo de "remember me" de facto para el MVP? ¿O el usuario espera que la sesión dure más? Esto afecta el test de "Redirect a returnUrl" y la expectativa de duración de sesión.
- **Impact if not clarified:** Si los usuarios esperan sesiones más largas, recibiremos bugs de UX reportados como errores de login.

**Ambiguity 3:** Opciones de currency_symbol — ¿lista fija o input libre?

- **Found in:** FIN-6
- **Question for PO/Dev:** La story muestra un dropdown con opciones (USD, EUR, GBP, COP, ARS) pero el campo acepta cualquier string de hasta 5 chars. ¿Es un dropdown cerrado (lista fija) o un input libre? El testing cambia completamente dependiendo de la respuesta.
- **Impact if not clarified:** Si es input libre, necesitamos tests de inyección y caracteres especiales; si es dropdown, solo validamos los valores del enum.

---

### Missing Information

**Missing 1:** Endpoint POST /api/auth/reset-password no documentado en api-contracts.yaml

- **Needed for:** API testing del flujo completo de password recovery. Actualmente solo existe /auth/forgot-password en el spec.
- **Suggestion:** Agregar endpoint `POST /auth/reset-password` al api-contracts.yaml con request body `{password: string, token: string}` y responses 200, 400 (token expired/invalid), 400 (weak password).

**Missing 2:** Estrategia de testing para email delivery (password recovery)

- **Needed for:** Testear FIN-5 Scenario 1 de extremo a extremo (incluyendo verificar que el email se envía)
- **Suggestion:** Definir si se usará Mailosaur, Mailtrap u otra herramienta de email testing en staging. Sin esto, FIN-5 no puede tener cobertura E2E completa.

**Missing 3:** Comportamiento de sesión multi-tab / multi-dispositivo

- **Needed for:** Edge cases de logout. Si el usuario hace logout en tab A, ¿qué pasa con la sesión en tab B?
- **Suggestion:** Agregar AC en FIN-4 sobre comportamiento multi-tab.

---

### Suggested Improvements (Before Implementation)

**Improvement 1:** Agregar endpoint reset-password al api-contracts.yaml

- **Story Affected:** FIN-5
- **Current State:** El flujo de reset-password está descrito en la story pero no en el contrato de API.
- **Suggested Change:** Documentar `POST /auth/reset-password` con schema completo antes de que Dev empiece.
- **Benefit:** Sin el contrato documentado, Dev y QA pueden implementar endpoints con schemas diferentes, causando bugs de integración.

**Improvement 2:** Clarificar AC de FIN-2 Scenario 1 sobre creación de perfil

- **Story Affected:** FIN-2
- **Current State:** El AC dice "un perfil debe ser creado en la tabla profiles" pero no especifica los campos por defecto que debe tener.
- **Suggested Change:** Agregar AC explícito: "El perfil debe crearse con currency_symbol='$' y name=null por defecto".
- **Benefit:** Sin esto, un Dev puede crear el perfil sin currency_symbol y no habría validación fallida en el AC.

**Improvement 3:** Definir AC para manejo de error de red en formularios

- **Story Affected:** FIN-2, FIN-3, FIN-5
- **Current State:** Ninguna story tiene AC para errores de red (timeout, 500, sin conexión).
- **Suggested Change:** Agregar AC genérico: "Si hay error de red durante el submit, el usuario debe ver un mensaje 'No pudimos procesar tu solicitud. Intenta de nuevo' con botón de retry."
- **Benefit:** El Journey 1 en user-journeys.md ya contempla este caso pero no está en los ACs de las stories.

---

## 🎯 Test Strategy

### Test Scope

**In Scope:**

- Functional testing (UI, API, Database) de los 5 flujos de auth
- Integration testing Frontend ↔ API ↔ Supabase Auth
- Security testing: rate limiting, enumeración de emails, JWT handling, RLS
- Cross-browser testing (Chrome, Firefox, Safari - iOS Safari P0)
- Mobile responsiveness (iOS Safari, Android Chrome)
- API contract validation (todos los endpoints de /auth/\*)
- Data validation: Zod schemas cliente + servidor

**Out of Scope (For This Epic):**

- Login social (Google, Facebook, Apple)
- 2FA (autenticación de dos factores)
- Cambio de email
- Eliminación de cuenta
- Performance/load testing (se delega a épica de NFRs)
- Penetration testing formal (se agenda post-launch)

---

### Test Levels

#### Unit Testing

- **Coverage Goal:** > 80% code coverage en utils y validaciones de auth
- **Focus Areas:**
  - Zod schemas de validación (RegisterSchema, LoginSchema, ProfileSchema)
  - Funciones de hash/comparación (si existen helpers propios)
  - Cálculo de TTL de tokens
- **Responsibility:** Dev team (QA valida que existan y pasen)

#### Integration Testing

- **Coverage Goal:** Todos los integration points identificados
- **Focus Areas:**
  - POST /auth/register → Supabase Auth + profiles creation
  - POST /auth/login → JWT generation + cookie setting
  - Middleware JWT validation en rutas protegidas
  - RLS enforcement en profiles table
- **Responsibility:** QA + Dev (pair)

#### E2E Testing

- **Coverage Goal:** Happy paths completos + escenarios críticos de error
- **Tool:** Playwright
- **Focus Areas:**
  - Journey 1 completo: Landing → Register → Dashboard
  - Login y redirect a returnUrl
  - Logout y bloqueo de rutas protegidas
  - Password recovery end-to-end (requiere email testing tool)
  - Profile edit con cambio de currency
- **Responsibility:** QA team

#### API Testing

- **Coverage Goal:** 100% endpoints de /auth/\* con contrato OpenAPI
- **Tool:** Postman/Newman
- **Focus Areas:**
  - Contract validation (request/response schemas)
  - Status codes correctos
  - Error handling (400, 401, 429)
  - Rate limiting enforcement
- **Responsibility:** QA team

---

### Test Types per Story

**Positive Test Cases:** Happy path + variaciones de datos válidos
**Negative Test Cases:** Inputs inválidos, credenciales incorrectas, tokens expirados
**Boundary Test Cases:** Password exactamente 8 chars, email 254 chars, nombre 100 chars
**Security Test Cases:** Rate limiting, enumeración de emails, cookies HTTP-only, RLS bypass intent

---

## 📊 Test Cases Summary by Story

### FIN-2: Registro de Usuario con Email y Contraseña

**Complexity:** High
**Estimated Test Cases:** 18

- Positive: 3 (registro exitoso, perfil creado con defaults, JWT tokens válidos)
- Negative: 5 (email duplicado, password < 8 chars, email formato inválido, campos vacíos, email > 254 chars)
- Boundary: 3 (password = 8 chars exacto, password = 128 chars, email = 254 chars)
- Integration: 4 (Supabase Auth call, profiles trigger/API, cookies HTTP-only, redirect al dashboard)
- API: 3 (201 success, 400 email exists, 429 rate limit)

**Rationale:** Alta complejidad por ser el punto de entrada del sistema, múltiples validation layers (frontend Zod + backend Zod + Supabase), y la integración con profiles.

**Parametrized Tests Recommended:** Yes — para validación de emails (RFC 5321 tiene muchos edge cases)

---

### FIN-3: Inicio de Sesión con Credenciales

**Complexity:** High (security critical path)
**Estimated Test Cases:** 14

- Positive: 2 (login exitoso, redirect a returnUrl)
- Negative: 4 (password incorrecta, email no registrado, campos vacíos, cuenta inexistente)
- Boundary: 1 (5to intento = permitido, 6to = bloqueado por rate limit)
- Security: 4 (mensaje de error genérico, tokens en HTTP-only cookies, rate limiting, access token TTL 1hr)
- API: 3 (200 success con tokens, 401 invalid credentials, 429 rate limit)

**Rationale:** Crítico para seguridad. El rate limiting y el manejo genérico de errores son fundamentales para evitar ataques de fuerza bruta y enumeración de cuentas.

**Parametrized Tests Recommended:** Yes — para variaciones de credenciales inválidas

---

### FIN-4: Cierre de Sesión

**Complexity:** Low-Medium
**Estimated Test Cases:** 8

- Positive: 2 (logout exitoso desde dashboard, logout desde dropdown menu)
- Security: 3 (cookies eliminadas, TanStack Query cache limpiado, rutas protegidas bloqueadas post-logout)
- Edge cases: 2 (logout con sesión expirada, sesión expirada auto-logout)
- API: 1 (200 success)

**Rationale:** Complejidad baja en funcionalidad pero crítico en seguridad. El limpiado de cookies y cache son los puntos más propensos a fallos.

**Parametrized Tests Recommended:** No

---

### FIN-5: Recuperación de Contraseña

**Complexity:** High (2 flows + email delivery + security)
**Estimated Test Cases:** 12

- Positive: 2 (solicitar email exitoso, resetear password con token válido)
- Negative: 3 (email no registrado, token expirado, nueva password < 8 chars)
- Security: 3 (mensaje genérico para ambos casos, token de uso único, HTTPS obligatorio)
- Rate limit: 1 (3 solicitudes/hora = bloqueado)
- API: 3 (forgot-password 200, reset-password 200, reset-password token expired)

**Rationale:** Alta complejidad por ser un flow de 2 pasos con dependencia externa (email service). El mayor riesgo es la integración con el email service y la validación del token de uso único.

**Parametrized Tests Recommended:** No

---

### FIN-6: Edición de Perfil de Usuario

**Complexity:** Low-Medium
**Estimated Test Cases:** 11

- Positive: 3 (actualizar nombre, actualizar currency_symbol, actualizar ambos)
- Negative: 2 (nombre > 100 chars, currency_symbol > 5 chars — si es input libre)
- Edge cases: 2 (nombre vacío permitido, cancelar sin guardar)
- Security: 2 (RLS — usuario A no puede editar perfil de usuario B, sin token = 401)
- API: 2 (200 success PATCH, 401 unauthorized)

**Rationale:** Funcionalidad simple pero con RLS crítico que previene acceso cross-user. Los tests de seguridad son más importantes que los de validación.

**Parametrized Tests Recommended:** Yes — si currency_symbol es input libre (caracteres especiales, unicode)

---

### Total Estimated Test Cases for Epic FIN-1

**Total: 63**

Breakdown:

- Positive: 12
- Negative: 14
- Boundary: 4
- Security/Rate limit: 13
- Integration: 4
- API: 12
- Edge cases: 4

---

## 🗂️ Test Data Requirements

### Test Data Strategy

**Valid Data Sets:**

- User Valentina: `valentina.test@finora.app` / `SecurePass123` / name: "Valentina Garcia" / currency: "$"
- User Andrés: `andres.test@finora.app` / `FreelancePass456` / name: "Andres Ramirez" / currency: "$"
- User Carmen: `carmen.test@finora.app` / `SimplePass789` / name: "Carmen Lopez" / currency: "EUR"

**Invalid Data Sets:**

- Emails inválidos: `notanemail`, `@nodomain.com`, `user@`, `user @example.com`, `user@exam ple.com`
- Passwords débiles: `abc`, `1234567` (7 chars), `` (vacío)
- Nombres muy largos: String de 101 caracteres

**Boundary Data Sets:**

- Password = exactamente 8 chars: `pass1234`
- Password = 128 chars: string de 128 caracteres
- Email = 254 chars: string largo válido
- Nombre = exactamente 100 chars
- Currency_symbol = exactamente 5 chars: `USDBR`

**Test Data Management:**

- ✅ Usar Faker.js para generar emails únicos por test run
- ✅ Crear usuarios de prueba frescos para cada E2E test que requiera estado limpio
- ❌ NO hardcodear emails — pueden colisionar entre runs
- ✅ Limpiar usuarios de prueba después de test execution (via Supabase admin API)

---

### Test Environments

**Staging Environment:**

- URL: https://staging.finora.app
- Database: Supabase staging project
- External Services: Supabase Email Service (staging)
- Email Testing: Mailosaur u equivalente (pendiente de setup — ver Critical Questions)
- **Purpose:** Primary testing environment

**Production Environment:**

- URL: https://finora.app
- **Purpose:** ONLY smoke tests post-deployment
- **Restrictions:** NO crear usuarios de prueba en producción, NO tests destructivos

---

## ✅ Entry/Exit Criteria

### Entry Criteria (Per Story)

Testing puede iniciar cuando:

- [ ] Story implementada y deployada a staging
- [ ] Code review aprobado por 2+ reviewers
- [ ] Unit tests existen y pasan (>80% coverage en auth utils)
- [ ] Dev ha hecho smoke testing y confirma que registro/login básico funciona
- [ ] No hay bugs bloqueantes en stories dependientes
- [ ] Test data preparada (usuarios de prueba en staging)
- [ ] API documentation actualizada (si hay cambios de contrato)

### Exit Criteria (Per Story)

Story es "Done" desde QA cuando:

- [ ] Todos los test cases ejecutados
- [ ] Critical/High priority test cases: 100% passing
- [ ] Medium/Low priority: ≥95% passing
- [ ] Todos los bugs críticos y altos resueltos y verificados
- [ ] Bugs medios tienen plan de mitigación
- [ ] Regression testing passed
- [ ] NFRs de seguridad validados (rate limiting, cookies HTTP-only, mensajes genéricos)
- [ ] Test execution report generado

### Epic Exit Criteria

FIN-1 es "Done" desde QA cuando:

- [ ] TODAS las stories (FIN-2 a FIN-6) cumplen exit criteria individual
- [ ] Integration testing del flow completo: Register → Login → Use app → Logout
- [ ] E2E del Journey 1 (Registro y Primer Gasto) completo y passing
- [ ] API contract testing completo para todos los endpoints de /auth/\*
- [ ] Security testing: rate limiting, enumeración, cookies, RLS
- [ ] Cross-browser testing: Chrome, Firefox, Safari (Desktop + Mobile)
- [ ] Zero bugs críticos o altos abiertos
- [ ] QA sign-off document creado y aprobado

---

## 📝 Non-Functional Requirements Validation

### Performance Requirements

**NFR-P-003 (Auth Operations < 300ms):**

- **Target:** Login, registro, token refresh < 300ms p95
- **Test Approach:** Medir response time en Postman / k6 con carga baja
- **Tools:** Postman (timing), Browser DevTools (Network tab)

**NFR-P-001 (LCP < 2s en páginas de auth):**

- **Target:** LCP < 2s en /register, /login
- **Test Approach:** Lighthouse audit en staging
- **Tools:** Lighthouse, Chrome DevTools

### Security Requirements

**NFR-S-2.3 (Datos de usuario solo accesibles por el dueño - RLS):**

- **Requirement:** RLS en tabla profiles — usuario A no puede leer/editar perfil de usuario B
- **Test Approach:** Crear usuario A y B en staging, autenticarse como A, intentar PATCH /api/auth/profile con ID de B
- **Tools:** Postman (manual bypass attempt)

**NFR-S-2.7 (Rate Limiting):**

- **Requirement:** Login: 5 intentos/15min; Register: 3/hr; Recovery: 3/hr
- **Test Approach:** Scripting automatizado con Postman para superar los límites
- **Tools:** Postman (collections con variables de iteración)

**NFR-S-2.5 (Input Validation — OWASP A03):**

- **Requirement:** Prevención de SQL injection, XSS en campos de auth
- **Test Approach:** Payloads de SQL injection en email/password, XSS en nombre de perfil
- **Tools:** Manual testing con payloads OWASP

### Usability Requirements

**WCAG 2.1 Level AA en formularios de auth:**

- **Requirement:** Formularios accesibles con keyboard, screen reader compatible
- **Test Approach:** Tab navigation en /register, /login; VoiceOver testing en iOS Safari
- **Tools:** axe-core (automated), VoiceOver (macOS/iOS)

---

## 🔄 Regression Testing Strategy

**Regression Scope:**
Esta épica es la base de todo el sistema. Post-implementación, cualquier cambio en auth puede afectar TODA la aplicación.

- [ ] Todas las rutas protegidas del sistema (dependen de JWT middleware)
- [ ] Dashboard data fetching (requiere sesión válida)
- [ ] Profile data display en toda la UI (depende de profiles table)

**Regression Test Execution:**

- Run smoke suite antes de iniciar testing de cada story
- Run full auth regression después de completar todas las stories
- Focus: middleware JWT, cookie management, RLS policies

---

## 📅 Testing Timeline Estimate

**Estimated Duration:** 0.5 sprint (~1 semana)

Breakdown:

- Test case design: 1 día
- Test data preparation: 0.5 días
- Test execution FIN-2 (18 TCs): 1 día
- Test execution FIN-3 (14 TCs): 0.75 días
- Test execution FIN-4 (8 TCs): 0.5 días
- Test execution FIN-5 (12 TCs): 1 día
- Test execution FIN-6 (11 TCs): 0.75 días
- Bug fixing cycles (buffer): 1 día
- Cross-browser + mobile: 0.5 días

**Dependencies:**

- Depends on: Nada (epic foundation)
- Blocks: EPIC-FIN-002 a EPIC-FIN-006 (todas dependen de esta épica)

---

## 🛠️ Tools & Infrastructure

**Testing Tools:**

- E2E Testing: Playwright (cross-browser, mobile emulation)
- API Testing: Postman/Newman (collections por endpoint)
- Unit Testing: Vitest (schemas Zod, utils)
- Email Testing: Mailosaur (pendiente — para FIN-5)
- Security Testing: OWASP ZAP (rate limiting, injection)
- Accessibility: axe-core en CI

**CI/CD Integration:**

- [ ] Tests corren automáticamente en PR creation
- [ ] Tests corren en merge a main (staging deploy)
- [ ] Smoke tests corren en deploy a producción

**Test Management:**

- Jira para tracking de bugs
- Test execution reports en comentarios de stories
- Feature test plan en comentario de epic FIN-1 (mirror de este archivo)

---

## 📊 Metrics & Reporting

**Test Metrics a trackear:**

- Test cases ejecutados vs. total (objetivo: 100% al final de la épica)
- Test pass rate (objetivo: >95%)
- Bugs encontrados por severity (Critical, High, Medium, Low)
- Tiempo promedio de testing por story
- Cobertura de código en módulo auth (objetivo: >80%)

**Reporting Cadence:**

- Per Story: Test completion report en comentario de la story
- Per Epic: Este documento actualizado con resultados finales
- Post-Sprint: QA sign-off report

---

## 🎓 Notes & Assumptions

**Assumptions:**

- Supabase Auth está configurado correctamente en staging antes de empezar testing
- El email service de Supabase está activo en staging (o se mockea para FIN-5)
- Los data-testid definidos en las stories están implementados (crítico para Playwright)
- HTTP-only cookies son la única estrategia de almacenamiento de tokens (no localStorage)

**Constraints:**

- Email testing de password recovery requiere herramienta adicional (Mailosaur) no configurada aún
- Testing de rate limiting real puede requerir esperar ventanas de tiempo (15min/1hr) — usar mocks donde sea posible

**Known Limitations:**

- El testing de Supabase Auth downtime requiere mocking del servicio — no se puede probar en staging real
- Los tests de performance (< 300ms) son orientativos sin carga; necesitan k6 para validación real

**Exploratory Testing Sessions:**

- Recomendadas: 2 sesiones ANTES de implementación
  - Session 1 (0.5 hr): Revisar flujos de auth en apps similares (Notion, Linear) buscando edge cases no cubiertos en stories
  - Session 2 (0.5 hr): Testing de recovery flow con delays de email simulados (patience testing)

---

## 📎 Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/epic.md`
- **Stories:** `.context/PBI/epics/EPIC-FIN-1-user-authentication/stories/STORY-*/story.md`
- **Business Model:** `.context/idea/business-model.md`
- **PRD:** `.context/PRD/` (executive-summary, user-personas, user-journeys)
- **SRS:** `.context/SRS/` (functional-specs FR-001 to FR-005, non-functional-specs, architecture-specs)
- **API Contracts:** `.context/SRS/api-contracts.yaml`
- **Jira Epic:** FIN-1 (comentario con test plan completo)

---

_Feature Test Plan generado: 2026-02-24_
_Metodología: Shift-Left Testing | Jira-First → Local Mirror_
_Versión: 1.0 — Draft_
