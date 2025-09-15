# Lead Manager — Design

## Goals

- Match the external & internal **mockups** as closely as possible.
- Keep the internal list minimal (Name / Submitted / Status / Country) and satisfy “show all submitted info” via a **details view**.
- Keep the solution **simple and interview-friendly**; added a small **Admin** button to move between public and internal.

## Architecture

- **Next.js App Router + TypeScript**
- Public form: `src/app/page.tsx`
- Internal list: `src/app/leads/page.tsx`
- Details page: `src/app/leads/[id]/page.tsx`
- API routes:
  - `src/app/api/leads/route.ts` — `GET` (list), `POST` (create), `PATCH` (update state)
  - `src/app/api/leads/[id]/route.ts` — `GET` (one)
  - `src/app/api/auth/login|logout/route.ts` — mock auth cookie
- **Data:** in-memory store (`src/lib/db.ts`) for demo simplicity
- **Validation:** Zod schema shared client/server (`src/lib/validation.ts`)
- **Auth:** `middleware.ts` guards `/leads/*`; login sets a simple `auth=true` cookie
- **Files:** resume uploaded via `<input type="file">`; stored as `{ filename, mime, base64 }`

## Matching the Mockups

- **External:** visa interest options = **O-1, EB-1A, EB-2 NIW, I don’t know** (multi-select checkboxes); **Country of Citizenship** combobox; **Thank You** state after submit.
- **Internal list:** columns = **Name, Submitted, Status, Country** with **sortable headers**, **search**, **status filter**, **pagination**, and disabled arrows at bounds.
- **All info:** click **Name** to open a detail view showing the full submission (including resume download).

## Tradeoffs

- In-memory DB resets on server restart (OK for take-home).
- Sorting/filtering/pagination are **client-side** (fine for small datasets).
- Middleware guards pages; API routes are left open for simplicity (would lock down in production).

## Visual Notes

- Created simple **SVG icons in Figma** to mirror the mock style. Chose not to add a large hero image to the green header since the asset wasn’t provided.
- Used **Font Awesome** for sort and pagination arrows (only show up/down on the active sort column; chevrons for paging; disabled state at bounds).
- Placed the **“Reached”** action **inline next to “Pending”** in the table so status can be updated quickly without leaving the list.
- Consistent input styles (custom combobox for Country, custom file upload button with filename preview) to match the mock’s look-and-feel.
