# Financial Advisor Panel — FB Alpha

Internal client management panel for a financial advisory firm. Built with **Angular 20**, featuring client CRUD operations, notes management, and a modern UI inspired by Facebook's design system.

## Quick Start

```bash
git clone https://github.com/LarizzaMRL/FP-Alpha-Test.git
cd fb-alpha
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## Features

- **Client List** — Table with search (client-side filtering) and pagination (10 items per page)
- **Client Detail** — View client information with associated notes
- **Create Client** — Modal with reactive form and field validations
- **Notes Management** — Add and delete notes with confirmation dialog
- **Dark Mode** — Theme toggle with CSS custom properties, persisted in localStorage
- **Skeleton Loaders** — Shimmer effect while data loads
- **Custom Pipes** — `timeAgo` (relative dates), `phoneFormat` (consistent phone formatting)
- **Route Guard** — Prevents navigation to detail if the `id` is not numeric
- **404 Error State** — Friendly error screen when a client is not found

## Tech Stack

| Technology | Version |
|---|---|
| Angular | 20.3 |
| TypeScript | 5.9 |
| Node.js | 20+ |
| RxJS | 7.8 |
| SCSS | — |

## Project Structure

```
src/app/
├── core/
│   ├── guards/         → numericIdGuard (functional guard)
│   ├── models/         → Client, Note interfaces and DTOs
│   └── services/       → ClientService, NoteService
├── shared/
│   ├── components/
│   │   ├── confirm-dialog/   → Reusable confirmation modal
│   │   ├── navbar/           → Top navigation with theme toggle
│   │   └── skeleton-loader/  → Loading placeholder
│   └── pipes/
│       ├── phone-format/     → Formats phone numbers as (XXX) XXX - XXXX
│       └── time-ago/         → Converts dates to relative time ("3 days ago")
├── features/
│   ├── client-list/    → Table + search + pagination
│   ├── client-detail/  → Client info + notes CRUD
│   └── client-form/    → Modal form to create clients
├── app.config.ts       → Providers (zoneless, router, httpClient)
├── app.routes.ts       → Lazy-loaded routes
└── app.html
```

## Technical Decisions

### Standalone Components
All components are standalone (default in Angular 20). No `NgModules` used, which reduces boilerplate and improves tree-shaking.

### Signals over BehaviorSubject
Used Angular Signals for reactive state management instead of RxJS BehaviorSubjects. Signals provide a simpler API (`signal()`, `.set()`, `.update()`, `computed()`) and integrate natively with Angular's change detection. RxJS is still used for HTTP calls as required.

### Zoneless Change Detection
Enabled `provideZonelessChangeDetection()` to run without Zone.js. This reduces bundle size and improves performance. Signals make this possible since they notify Angular of changes without zones.

### Local State Management
Since JSONPlaceholder doesn't persist data, both `ClientService` and `NoteService` maintain local state using Signals. Created clients and notes are stored in memory and reflected immediately in the UI. The `clientsSignal` holds the client list and `notesMap` stores notes grouped by `userId` in a `Map<number, Note[]>`.

### DTOs (Data Transfer Objects)
Separated `Client` from `CreateClientDto` and `Note` from `CreateNoteDto` to enforce type safety. DTOs represent the shape of data sent to the API (without `id`), while the full interfaces represent persisted entities.

### Lazy Loading
Routes use `loadComponent()` for code splitting. Each feature component is loaded on demand, reducing the initial bundle size.

### Functional Guard
The `numericIdGuard` uses the modern functional approach (`CanActivateFn`) instead of class-based guards. It validates that the `:id` param is numeric before allowing navigation.

### CSS Custom Properties for Theming
Dark mode is implemented with CSS variables defined in `:root` and `[data-theme='dark']`. This approach avoids duplicating styles and allows instant theme switching. The preference is persisted in `localStorage`.

### Date Handling
JSONPlaceholder users don't include a `createdAt` field. The `ClientService` generates random dates within the last 90 days when mapping API data to the internal `Client` model, providing realistic data for the `timeAgo` pipe.

## API

Uses [JSONPlaceholder](https://jsonplaceholder.typicode.com) as a simulated REST API:

| Action | Endpoint |
|---|---|
| List clients | `GET /users` |
| Client detail | `GET /users/:id` |
| Create client | `POST /users` |
| List client notes | `GET /posts?userId=:id` |
| Create note | `POST /posts` |
| Delete note | `DELETE /posts/:id` |

## AI Usage

I used Claude (Anthropic) as a development assistant for:

- **Project scaffolding** — Defining folder structure and architecture decisions
- **Styling** — CSS structure for dark mode with custom properties and skeleton loaders

All code was reviewed, understood, and adapted to fit the project requirements. Business logic, validations, and component integration were implemented and tested manually.
