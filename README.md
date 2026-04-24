# Invoice Management App

A fully responsive, full-featured Invoice Management Application built with **React + TypeScript + Vite**, supporting complete CRUD, dark mode, form validation, and persistent local storage.

---

## Live Demo

> Deploy to Vercel: `vercel --prod` from the project root  
> Deploy to Netlify: drag the `dist/` folder into Netlify's dashboard

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Install & Run

```bash
# Clone the repository
git clone [https://github.com/greythedevvinvoice-app.git](https://github.com/greythedevv/Invoice-Management-App.git)
cd invoice-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs on `http://localhost:5173` by default.

---

## Architecture

```
src/
├── assets/                  # SVG icons, images
├── components/
│   ├── sidebar.tsx          # Responsive sidebar (top bar on mobile, left bar on desktop)
│   ├── InvoiceForm.tsx      # Create / Edit invoice drawer
│   ├── InvoiceList.tsx      # Invoice list with status badges
│   └── DeleteModal.tsx      # Accessible confirmation modal
├── context/
│   └── InvoiceContext.tsx   # Global state, dark mode, localStorage persistence
├── data/
│   └── data.ts              # TypeScript types + seed data
├── pages/
│   ├── InvoiceList.tsx      # List page with filter
│   └── InvoiceDetail.tsx    # Detail / single invoice view
├── App.tsx                  # Route definitions + global InvoiceForm overlay
└── main.tsx                 # Entry point, InvoiceProvider wraps entire app
```

### State Management

All app state lives in **`InvoiceContext`** — a single React Context + `useState` store. This avoids prop-drilling and makes state accessible from any page or component.

```
InvoiceProvider (wraps entire app in main.tsx)
 ├── invoices[]       — the source of truth for all invoices
 ├── isFormOpen       — controls whether the drawer is visible
 ├── editingInvoice   — null = new form, Invoice = edit form
 ├── isDark           — global theme state
 └── actions: addInvoice, updateInvoice, deleteInvoice, markAsPaid,
              openNewForm, openEditForm, closeForm, toggleDark
```

### Persistence

- **Invoices** — saved to `localStorage` under key `invoice-app-invoices` on every state change via `useEffect`.
- **Theme preference** — saved to `localStorage` under `invoice-app-theme`, applied to `:root` via injected CSS variables (`--bg-page`, `--bg-card`, `--text-primary`, etc.) so all components respond without prop drilling.
- Data survives hard refresh, tab close, and browser restart.

### Routing

React Router v6 with two routes:
| Route | Component |
|-------|-----------|
| `/` | `InvoiceListPage` |
| `/invoice/:id` | `InvoiceDetail` |

`<InvoiceForm>` is rendered **outside** `<Routes>` in `App.tsx` so it overlays any page — this is what makes Edit work from the detail page without navigation.

---

## Feature Checklist

| Requirement | Status |
|---|---|
| Create invoices | ✅ |
| Read (list + detail) | ✅ |
| Update invoices (edit form pre-populates) | ✅ |
| Delete with confirmation modal | ✅ |
| Save as draft | ✅ |
| Mark as paid | ✅ |
| Filter by status (multi-select) | ✅ |
| Toggle light / dark mode | ✅ |
| Dark mode persists on reload | ✅ |
| Invoice list persists on reload | ✅ |
| Form validation (required fields) | ✅ |
| Email format validation | ✅ |
| Qty must be ≥ 1 | ✅ |
| Price must be > 0 | ✅ |
| At least one item required | ✅ |
| Draft skips validation | ✅ |
| Error state: red border + inline message | ✅ |
| Errors clear as you type | ✅ |
| Paid invoices cannot be unmarked | ✅ |
| Responsive: mobile 320px+ | ✅ |
| Responsive: tablet 768px+ | ✅ |
| Responsive: desktop 1024px+ | ✅ |
| No horizontal overflow | ✅ |
| Hover states on all interactive elements | ✅ |
| Empty state when no invoices match filter | ✅ |

---

## Validation Rules

| Field | Rule |
|---|---|
| All required fields | Cannot be empty on Save & Send |
| Client email | Must match `\S+@\S+\.\S+` pattern |
| Item name | Cannot be empty |
| Item quantity | Must be ≥ 1 |
| Item price | Must be > 0 |
| Item list | Must contain at least one item |
| Draft saves | Skip all validation |

---

## Responsive Design

| Breakpoint | Sidebar | Layout |
|---|---|---|
| `< 768px` (mobile) | Fixed top bar (72px height) | Single column, full-width form drawer |
| `768px–1023px` (tablet) | Fixed top bar | Single column, max-width content |
| `≥ 1024px` (desktop) | Fixed left strip (72px wide) | Left sidebar + main content |

The sidebar gracefully switches orientation: on mobile/tablet it becomes a horizontal top navigation bar using CSS media queries with no JavaScript required.

---

## Accessibility Notes

### Semantic HTML
- `<main>` with `id="main-content"` on all pages
- `<article>` for invoice detail card
- `<section>` for invoice items
- `<fieldset>` + `<legend>` groups form sections (Bill From / Bill To)
- `<address>` for address blocks
- `<label htmlFor>` paired with every `<input>` via explicit `id`

### Modal (Delete Confirmation)
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + `aria-describedby`
- Focus moves to Cancel button on mount (`useRef` + `focus()`)
- **ESC key** closes the modal
- **Focus trap**: Tab cycles only between Cancel and Delete buttons
- Backdrop click closes modal

### Form
- All inputs have visible `<label>` elements
- `aria-invalid="true"` set on invalid fields
- Error messages use `role="alert"` + `aria-live="polite"` for screen reader announcements
- ESC key closes the form drawer
- Screen-reader-only labels on item inputs via `.sr-only` class

### Interactive States
- All `<button>` elements use `:focus-visible` outlines (2px solid `#7C5DFA`)
- Filter options are keyboard-navigable (Enter/Space to toggle)
- Filter dropdown has `role="listbox"` + `aria-multiselectable` + `aria-selected` per option

### Color Contrast
- Body text on light: `#0C0E16` on `#F8F8FB` — passes WCAG AA (9.8:1)
- Body text on dark: `#FFFFFF` on `#141625` — passes WCAG AA (17:1)
- Error red `#EC5757` on white — passes WCAG AA (4.6:1)
- Purple `#7C5DFA` used only on non-text decorative elements

---

## Trade-offs & Decisions

### Local state vs. external store (Redux/Zustand)
Chose React Context + `useState` for simplicity. For a larger app or team, Zustand would offer better devtools and less boilerplate.

### CSS-in-JS approach (inline styles + `<style>` tags)
Used inline styles and scoped `<style>` tags rather than a CSS framework or CSS modules. This keeps everything self-contained in each component and avoids Tailwind JIT compilation issues in some environments. Trade-off: slightly verbose component files.

### No backend
Persistence is via `localStorage`. IndexedDB would handle larger datasets better, but for an invoice app with < 1000 entries, localStorage is appropriate and simpler.

### Filter: multi-select vs. single-select
Upgraded to multi-select (checkbox filter) so users can view Draft + Pending simultaneously — matching common real-world use cases.

---

## Improvements Beyond Requirements

- **Multi-select filter** — select multiple statuses simultaneously
- **ESC key** closes both the form drawer and the delete modal
- **Outside click** dismisses the filter dropdown
- **Per-item validation** — each item row shows its own inline errors
- **Animated entrance** — `fadeUp` animations on page load and `dropIn` on dropdown
- **Email link** — client email in detail view is a clickable `mailto:` link
- **Auto-calculated totals** — item total and grand total update in real-time as you type
- **Accessible status badge** — uses `role="status"` + `aria-label` for screen readers
- **Sidebar aria-label** — `role="navigation"` + descriptive label
- **Theme via CSS variables** — instant theme switching with no React re-renders on child components

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool & dev server |
| React Router | 6 | Client-side routing |
| React Icons | 5 | SVG icon components |
| localStorage | Browser API | Persistence |

---

## License

MIT
