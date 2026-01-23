# Finora Design System

## Resumen

Design system para **Finora** — app de finanzas personales con estilo **Verde Moderno + Bold**.

---

## 1. Paleta de Colores

### Primary — Verde Moderno

El color primario transmite **crecimiento financiero, innovación y confianza**.

| Variable               | HSL         | Hex Aproximado | Uso                               |
| ---------------------- | ----------- | -------------- | --------------------------------- |
| `--primary`            | 158 64% 40% | #10B981        | Botones, links, focus, highlights |
| `--primary-foreground` | 0 0% 100%   | #FFFFFF        | Texto sobre primary               |

### Background & Foreground

| Variable       | Light Mode  | Dark Mode   | Uso             |
| -------------- | ----------- | ----------- | --------------- |
| `--background` | 0 0% 100%   | 160 15% 8%  | Fondo de página |
| `--foreground` | 160 10% 10% | 150 10% 95% | Texto principal |

### Surfaces

| Variable   | Light Mode  | Dark Mode   | Uso                    |
| ---------- | ----------- | ----------- | ---------------------- |
| `--card`   | 0 0% 100%   | 160 12% 12% | Tarjetas, contenedores |
| `--muted`  | 150 10% 95% | 160 10% 18% | Fondos secundarios     |
| `--accent` | 158 70% 94% | 160 15% 18% | Hover, selección       |

### Semantic Colors

| Variable        | Valor       | Uso                            |
| --------------- | ----------- | ------------------------------ |
| `--destructive` | 0 84% 60%   | Errores, acciones destructivas |
| `--border`      | 150 10% 90% | Bordes de elementos            |
| `--input`       | 150 10% 90% | Bordes de inputs               |
| `--ring`        | 158 64% 40% | Focus ring (mismo que primary) |

### Colores de Categorías (Gastos)

| Categoría       | Color   | Uso                   |
| --------------- | ------- | --------------------- |
| Alimentación    | #FF6B6B | Chart, badges, iconos |
| Transporte      | #4ECDC4 | Chart, badges, iconos |
| Entretenimiento | #45B7D1 | Chart, badges, iconos |
| Salud           | #96CEB4 | Chart, badges, iconos |
| Educación       | #FFEAA7 | Chart, badges, iconos |
| Hogar           | #DDA0DD | Chart, badges, iconos |
| Ropa            | #98D8C8 | Chart, badges, iconos |
| Tecnología      | #7C73E6 | Chart, badges, iconos |
| Servicios       | #F8B500 | Chart, badges, iconos |
| Otros           | #95A5A6 | Chart, badges, iconos |

---

## 2. Tipografía

### Font Family

```css
font-family: var(--font-inter), system-ui, sans-serif;
```

- **Inter** — Font principal (Google Fonts)
- Fallback a system-ui para rendimiento

### Tamaños

| Clase       | Size | Weight | Uso                 |
| ----------- | ---- | ------ | ------------------- |
| `text-xs`   | 12px | 400    | Captions, helpers   |
| `text-sm`   | 14px | 400    | Body secundario     |
| `text-base` | 16px | 400    | Body principal      |
| `text-lg`   | 18px | 500    | Subtítulos          |
| `text-xl`   | 20px | 600    | Títulos pequeños    |
| `text-2xl`  | 24px | 700    | Títulos de sección  |
| `text-3xl`  | 30px | 700    | Títulos principales |

---

## 3. Espaciado

### Border Radius (Estilo Bold)

```css
--radius: 0.75rem; /* 12px - más redondeado que default */
```

| Clase          | Value                     | Uso                   |
| -------------- | ------------------------- | --------------------- |
| `rounded-sm`   | calc(var(--radius) - 4px) | Badges pequeños       |
| `rounded-md`   | calc(var(--radius) - 2px) | Inputs, botones small |
| `rounded-lg`   | var(--radius)             | Cards, contenedores   |
| `rounded-xl`   | 16px                      | Cards destacadas      |
| `rounded-full` | 9999px                    | Avatares, pills       |

### Padding / Margin

Sistema de 4px base:

- `p-1` = 4px
- `p-2` = 8px
- `p-3` = 12px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px

---

## 4. Sombras (Estilo Bold)

```css
.shadow-card {
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.shadow-card-hover {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

---

## 5. Componentes UI (shadcn/ui)

### Instalados

| Componente     | Uso                          |
| -------------- | ---------------------------- |
| `Button`       | CTAs, acciones               |
| `Card`         | Contenedores de información  |
| `Input`        | Campos de formulario         |
| `Label`        | Etiquetas de campos          |
| `Avatar`       | Foto de perfil de usuario    |
| `Badge`        | Tags, estados                |
| `Alert`        | Mensajes, notificaciones     |
| `DropdownMenu` | Menús contextuales           |
| `Sheet`        | Sidebars móviles, drawers    |
| `Skeleton`     | Loading states               |
| `Separator`    | Divisores                    |
| `Tooltip`      | Hints, información adicional |

### Uso de Button

```tsx
import { Button } from '@/components/ui/button'

// Primary (default)
<Button>Guardar</Button>

// Variantes
<Button variant="secondary">Cancelar</Button>
<Button variant="outline">Ver más</Button>
<Button variant="ghost">Cerrar</Button>
<Button variant="destructive">Eliminar</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grande</Button>
```

### Uso de Card

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

<Card className="shadow-card transition-smooth hover:shadow-card-hover">
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Contenido aquí</CardContent>
  <CardFooter>Acciones aquí</CardFooter>
</Card>;
```

---

## 6. Layout System

### Sidebar Collapsible

- **Ancho expandido:** 256px (w-64)
- **Ancho colapsado:** 72px (w-[72px])
- **Transición:** duration-200 ease-out
- **Estado:** Guardado en localStorage (`finora-sidebar-collapsed`)

### Navbar

- **Altura:** 64px (h-16)
- **Background:** card/80 con backdrop-blur
- **Sticky:** top-0

### Responsive Breakpoints

| Breakpoint | Width   | Comportamiento                |
| ---------- | ------- | ----------------------------- |
| Mobile     | < 640px | Sidebar hidden, Sheet drawer  |
| Tablet     | 768px   | Sidebar visible               |
| Desktop    | 1024px+ | Sidebar expandido por default |

---

## 7. Transiciones

```css
.transition-smooth {
  transition: all 200ms ease-out;
}
```

Aplicar a:

- Hover states en cards
- Sidebar collapse/expand
- Botones hover/active
- Progress bars

---

## 8. Iconos

**Biblioteca:** Lucide React

```tsx
import { LayoutDashboard, ArrowLeftRight, CreditCard, Target, RefreshCw, User } from 'lucide-react'

// Tamaños estándar
<Icon className="h-4 w-4" /> // Pequeño (botones)
<Icon className="h-5 w-5" /> // Normal (navegación)
<Icon className="h-6 w-6" /> // Grande (headers)
```

### Iconos por Sección

| Sección       | Icono           |
| ------------- | --------------- |
| Dashboard     | LayoutDashboard |
| Transacciones | ArrowLeftRight  |
| Deudas        | CreditCard      |
| Metas         | Target          |
| Suscripciones | RefreshCw       |
| Perfil        | User            |

---

## 9. Patterns de Uso

### Gradientes (Estilo Bold)

```tsx
// Background gradiente sutil
<div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

// Card con gradiente
<div className="bg-gradient-card" />
```

### Estados de Carga

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Avatar loading
<Skeleton className="h-9 w-9 rounded-full" />

// Card loading
<Skeleton className="h-[200px] w-full rounded-lg" />
```

### Hover Effects

```tsx
// Card con hover
<Card className="shadow-card transition-smooth hover:shadow-card-hover" />

// Item clickeable
<div className="rounded-lg p-2 transition-smooth hover:bg-muted/50" />
```

---

## 10. Archivos de Referencia

| Archivo                  | Contenido                |
| ------------------------ | ------------------------ |
| `tailwind.config.ts`     | Configuración de colores |
| `src/app/globals.css`    | CSS variables, utilities |
| `src/components/ui/`     | Componentes shadcn/ui    |
| `src/components/layout/` | Layout components        |
| `src/lib/utils.ts`       | Función cn()             |

---

## 11. Checklist de Implementación

Cuando implementes nuevas páginas, asegúrate de:

- [ ] Usar `Card` para contenedores con `shadow-card`
- [ ] Aplicar `transition-smooth` en elementos interactivos
- [ ] Usar colores semánticos (`primary`, `destructive`, etc.)
- [ ] Respetar el border-radius (--radius)
- [ ] Implementar estados de loading con `Skeleton`
- [ ] Usar iconos de Lucide React
- [ ] Mantener consistencia con la paleta verde
- [ ] Probar en móvil (responsive)

---

**Última actualización:** 2025-01-23
**Versión:** 1.0.0
