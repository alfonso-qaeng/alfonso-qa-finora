# Non-Functional Specifications — Finora

> Requisitos no funcionales del MVP

*Version: 1.0 | MVP | Fecha: Enero 2025*

---

## 1. Performance

### 1.1 Core Web Vitals

| Métrica | Target | Medición |
|---------|--------|----------|
| **LCP** (Largest Contentful Paint) | < 2.0s | Lighthouse, PageSpeed Insights |
| **FID** (First Input Delay) | < 100ms | Lighthouse, Web Vitals |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Lighthouse, Web Vitals |
| **TTI** (Time to Interactive) | < 3.0s | Lighthouse |
| **TTFB** (Time to First Byte) | < 600ms | Lighthouse, Chrome DevTools |

### 1.2 API Performance

| Métrica | Target | Condiciones |
|---------|--------|-------------|
| **Response Time (p50)** | < 200ms | Queries simples (GET single resource) |
| **Response Time (p95)** | < 500ms | Todas las operaciones |
| **Response Time (p99)** | < 1000ms | Operaciones complejas (dashboard aggregations) |
| **Database Query Time** | < 100ms | Queries simples con índices |
| **Auth Operations** | < 300ms | Login, registro, token refresh |

### 1.3 Concurrencia

| Escenario | Capacidad | Notas |
|-----------|-----------|-------|
| **Usuarios Concurrentes (MVP)** | 100 | Free tier de Supabase + Vercel |
| **Usuarios Concurrentes (Escala)** | 1,000+ | Con plan paid de Supabase |
| **Requests por segundo** | 100 rps | Por instancia de Vercel |
| **Database Connections** | 60 | Supabase free tier pooling |

### 1.4 Payload Limits

| Recurso | Límite |
|---------|--------|
| **Request Body** | 1MB max |
| **Response Payload** | 5MB max |
| **Pagination Default** | 20 items |
| **Pagination Max** | 100 items |
| **Text Fields** | 255 caracteres (description), 100 (names) |

---

## 2. Security

### 2.1 Authentication

| Aspecto | Implementación |
|---------|----------------|
| **Provider** | Supabase Auth (built-in) |
| **Method** | Email + Password |
| **Token Type** | JWT (JSON Web Token) |
| **Token Lifetime** | Access: 1 hora, Refresh: 7 días |
| **Password Storage** | bcrypt (via Supabase, cost factor 10) |
| **Session Management** | Server-side session tracking |

### 2.2 Password Policy

| Requisito | Valor |
|-----------|-------|
| **Longitud mínima** | 8 caracteres |
| **Complejidad** | Al menos 1 letra y 1 número (recomendado) |
| **Historial** | No reutilizar últimas 3 contraseñas (v2) |
| **Expiración** | Sin expiración (MVP) |

### 2.3 Authorization

| Aspecto | Implementación |
|---------|----------------|
| **Model** | Row Level Security (RLS) en PostgreSQL |
| **Roles MVP** | `user` (único rol) |
| **Data Isolation** | Usuarios solo acceden a sus propios datos |
| **API Protection** | JWT validation en cada request |

### 2.4 Data Protection

| Aspecto | Implementación |
|---------|----------------|
| **Encryption at Rest** | AES-256 (Supabase managed) |
| **Encryption in Transit** | TLS 1.3 (HTTPS obligatorio) |
| **Sensitive Data** | No almacenar datos de tarjetas/bancos |
| **PII Handling** | Email encriptado, passwords hasheados |

### 2.5 Input Validation

| Capa | Implementación |
|------|----------------|
| **Client-side** | Zod schemas + React Hook Form |
| **Server-side** | Zod schemas (mismos schemas compartidos) |
| **Database** | Constraints + CHECK constraints |
| **Sanitization** | HTML escape en outputs, SQL injection prevention (Supabase) |

### 2.6 OWASP Top 10 Mitigations

| Vulnerabilidad | Mitigación |
|----------------|------------|
| **A01: Broken Access Control** | RLS, JWT validation, ownership checks |
| **A02: Cryptographic Failures** | TLS 1.3, bcrypt, AES-256 |
| **A03: Injection** | Parameterized queries (Supabase client), Zod validation |
| **A04: Insecure Design** | Principle of least privilege, RLS by default |
| **A05: Security Misconfiguration** | Environment variables, no secrets in code |
| **A06: Vulnerable Components** | Dependabot, npm audit, actualizaciones regulares |
| **A07: Auth Failures** | Rate limiting, secure password policy |
| **A08: Data Integrity** | Input validation, CSRF tokens (Next.js built-in) |
| **A09: Logging Failures** | Structured logging, no sensitive data in logs |
| **A10: SSRF** | No external URL fetching en MVP |

### 2.7 Rate Limiting

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| **Login** | 5 intentos | 15 minutos por IP |
| **Register** | 3 intentos | 1 hora por IP |
| **Password Reset** | 3 solicitudes | 1 hora por email |
| **API General** | 100 requests | 1 minuto por user |

---

## 3. Scalability

### 3.1 Architecture Patterns

| Aspecto | Implementación |
|---------|----------------|
| **Frontend** | Static generation + ISR (Next.js) |
| **API** | Stateless (serverless-ready) |
| **Database** | PostgreSQL con connection pooling |
| **Caching** | Edge caching (Vercel), stale-while-revalidate |

### 3.2 Database Scalability

| Aspecto | Implementación |
|---------|----------------|
| **Connection Pooling** | Supabase Pooler (PgBouncer) |
| **Read Replicas** | Disponible en Supabase Pro (v2) |
| **Indexes** | En foreign keys, dates, user_id |
| **Partitioning** | Por fecha en transactions (v2 si necesario) |

### 3.3 CDN & Edge

| Aspecto | Implementación |
|---------|----------------|
| **Static Assets** | Vercel Edge Network |
| **API Responses** | Cache-Control headers |
| **Images** | Next.js Image Optimization |
| **Geographic Distribution** | Vercel global edge network |

### 3.4 Caching Strategy

| Recurso | TTL | Strategy |
|---------|-----|----------|
| **Static Pages** | 1 hora | ISR revalidation |
| **Categories List** | 24 horas | Inmutable en MVP |
| **User Profile** | 5 minutos | stale-while-revalidate |
| **Dashboard Data** | 1 minuto | On-demand revalidation |
| **Transactions List** | No cache | Real-time freshness |

---

## 4. Accessibility (a11y)

### 4.1 WCAG Compliance

| Level | Status | Notas |
|-------|--------|-------|
| **WCAG 2.1 Level A** | Requerido | Criterios básicos |
| **WCAG 2.1 Level AA** | Requerido | Target para MVP |
| **WCAG 2.1 Level AAA** | Nice to have | Criterios selectos |

### 4.2 Criterios Clave

| Criterio | Implementación |
|----------|----------------|
| **1.1.1 Non-text Content** | Alt text en imágenes, aria-label en iconos |
| **1.3.1 Info and Relationships** | Semantic HTML, ARIA landmarks |
| **1.4.3 Contrast (Minimum)** | 4.5:1 para texto normal, 3:1 para texto grande |
| **1.4.11 Non-text Contrast** | 3:1 para UI components |
| **2.1.1 Keyboard** | Todos los elementos interactivos accesibles |
| **2.4.3 Focus Order** | Tab order lógico |
| **2.4.7 Focus Visible** | Focus ring visible (2px solid) |
| **3.3.1 Error Identification** | Errores asociados a campos con aria-describedby |
| **4.1.2 Name, Role, Value** | ARIA labels en componentes custom |

### 4.3 Implementación Técnica

| Aspecto | Implementación |
|---------|----------------|
| **Components** | Shadcn/ui (accesibilidad built-in) |
| **Testing** | axe-core en CI, manual testing |
| **Focus Management** | Focus trap en modals, focus restoration |
| **Screen Readers** | Testing con VoiceOver, NVDA |
| **Reduced Motion** | `prefers-reduced-motion` media query |
| **Color Independence** | No comunicar info solo con color |

### 4.4 Accessibility Testing

| Tool | Uso |
|------|-----|
| **axe-core** | Automated testing en CI |
| **Lighthouse a11y** | Auditorías periódicas |
| **WAVE** | Testing manual |
| **Keyboard Testing** | Manual en cada feature |
| **Screen Reader** | VoiceOver (macOS/iOS), NVDA (Windows) |

---

## 5. Browser & Device Support

### 5.1 Desktop Browsers

| Browser | Versiones | Priority |
|---------|-----------|----------|
| **Chrome** | Últimas 2 | P0 |
| **Firefox** | Últimas 2 | P0 |
| **Safari** | Últimas 2 | P0 |
| **Edge** | Últimas 2 | P1 |

### 5.2 Mobile Browsers

| Browser | Versiones | Priority |
|---------|-----------|----------|
| **iOS Safari** | Últimas 2 (iOS 16+) | P0 |
| **Android Chrome** | Últimas 2 | P0 |
| **Samsung Internet** | Últimas 2 | P2 |

### 5.3 Responsive Breakpoints

| Breakpoint | Width | Devices |
|------------|-------|---------|
| **xs** | < 640px | Mobile phones |
| **sm** | 640px+ | Large phones, small tablets |
| **md** | 768px+ | Tablets |
| **lg** | 1024px+ | Laptops, desktops |
| **xl** | 1280px+ | Large desktops |
| **2xl** | 1536px+ | Extra large screens |

### 5.4 Progressive Enhancement

| Feature | Fallback |
|---------|----------|
| **JavaScript disabled** | Server-rendered HTML funcional |
| **CSS Grid** | Flexbox fallback |
| **Web Animations** | CSS transitions |
| **Intersection Observer** | Scroll event fallback |

---

## 6. Reliability

### 6.1 Uptime Targets

| Métrica | Target | Periodo |
|---------|--------|---------|
| **Uptime** | 99.9% | Mensual |
| **Downtime Permitido** | < 43 min/mes | - |
| **Planned Maintenance** | < 4 horas/mes | Fuera de horario pico |

### 6.2 Error Handling

| Aspecto | Implementación |
|---------|----------------|
| **Error Boundaries** | React Error Boundaries en cada módulo |
| **API Errors** | Respuestas consistentes con códigos estándar |
| **Retry Logic** | 3 reintentos con exponential backoff |
| **Graceful Degradation** | UI funcional con features limitadas si hay errores |

### 6.3 Monitoring

| Aspecto | Tool |
|---------|------|
| **Application Errors** | Vercel Analytics (MVP), Sentry (v2) |
| **Uptime Monitoring** | Vercel Status |
| **Performance** | Vercel Web Vitals |
| **Database** | Supabase Dashboard |

### 6.4 Backup & Recovery

| Aspecto | Implementación |
|---------|----------------|
| **Database Backups** | Supabase automated (daily) |
| **Point-in-time Recovery** | Supabase Pro feature (v2) |
| **Backup Retention** | 7 días (free tier) |
| **Recovery Time Objective** | < 1 hora |

---

## 7. Maintainability

### 7.1 Code Quality

| Aspecto | Implementación |
|---------|----------------|
| **TypeScript** | Strict mode habilitado |
| **Linting** | ESLint con config strict |
| **Formatting** | Prettier (automático en save) |
| **Type Coverage** | 100% (sin `any` explícitos) |

### 7.2 Testing

| Tipo | Coverage Target | Tool |
|------|-----------------|------|
| **Unit Tests** | > 80% | Vitest |
| **Integration Tests** | > 60% | Vitest + Testing Library |
| **E2E Tests** | Critical paths 100% | Playwright |
| **API Tests** | > 90% | Postman/Newman |
| **Accessibility Tests** | 100% components | axe-core |

### 7.3 Documentation

| Documento | Ubicación |
|-----------|-----------|
| **README** | `/README.md` |
| **API Docs** | `/docs/api/` (generated from OpenAPI) |
| **Architecture** | `.context/SRS/architecture-specs.md` |
| **Component Storybook** | `/storybook/` (v2) |
| **ADRs** | `.context/decisions/` |

### 7.4 CI/CD

| Stage | Checks |
|-------|--------|
| **Pre-commit** | Lint, format, type-check |
| **PR** | Tests, build, preview deploy |
| **Main** | Deploy to staging |
| **Release** | Deploy to production |

### 7.5 Dependencies

| Aspecto | Implementación |
|---------|----------------|
| **Updates** | Dependabot weekly |
| **Security** | `npm audit` en CI |
| **Lock File** | `package-lock.json` committed |
| **Node Version** | 20 LTS (especificado en `.nvmrc`) |

---

## 8. Internationalization (i18n)

### 8.1 MVP Scope

| Aspecto | Status |
|---------|--------|
| **Idioma** | Solo español |
| **Locale** | es-ES (España), es-MX (México) |
| **Moneda** | Símbolo configurable por usuario |
| **Timezone** | UTC storage, local display |

### 8.2 i18n-Ready (v2)

| Aspecto | Preparación |
|---------|-------------|
| **Strings** | Extraíbles a archivos JSON |
| **Date Formatting** | Intl.DateTimeFormat |
| **Number Formatting** | Intl.NumberFormat |
| **Currency Formatting** | Intl.NumberFormat con currency |

---

## 9. Data Privacy & Compliance

### 9.1 GDPR Considerations (Futuro)

| Aspecto | Status |
|---------|--------|
| **Right to Access** | Export endpoint planificado |
| **Right to Erasure** | Delete account planificado |
| **Data Portability** | Export to JSON/CSV (v2) |
| **Consent** | Terms of Service en registro |

### 9.2 Data Retention

| Dato | Retención |
|------|-----------|
| **User Account** | Hasta delete request |
| **Transactions** | Indefinido (user data) |
| **Session Logs** | 30 días |
| **Error Logs** | 7 días |

---

## 10. Resumen de NFRs

| Categoría | Requisito Clave | Target |
|-----------|-----------------|--------|
| **Performance** | LCP | < 2s |
| **Performance** | API Response p95 | < 500ms |
| **Security** | Auth | JWT + RLS |
| **Security** | Password | min 8 chars |
| **Accessibility** | WCAG | Level AA |
| **Reliability** | Uptime | 99.9% |
| **Maintainability** | Test Coverage | > 80% |
| **Browser** | Support | Chrome, Firefox, Safari, Edge (últimas 2) |

---

*Documento generado para: `.context/SRS/non-functional-specs.md`*
*Última actualización: Enero 2025*
