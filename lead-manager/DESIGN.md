# Lead Manager — Design (Updated)


## Goals
- Match the external & internal **mockups** exactly where possible.
- Satisfy "Internal UI shows all submitted info" via a **details view** while keeping the list minimal (Name / Submitted / Status / Country) per mock.
- Keep the solution lightweight and interview-friendly.


## Architecture
- **Next.js App Router (TypeScript)**
- Public form: `src/app/page.tsx` (now **JsonForms**-driven)
- Internal list: `src/app/leads/page.tsx`
- Details page: `src/app/leads/[id]/page.tsx` (fetches from API)
- API routes: `src/app/api/leads` (create/list/update) and `src/app/api/leads/[id]` (fetch single)
- **Data**: In-memory store (`src/lib/db.ts`) for demo simplicity.
- **Validation**: Zod (`src/lib/validation.ts`) + JsonForms (AJV) on the public form.
- **Auth**: Mock cookie flag via `/api/auth/login` + `middleware.ts` protecting `/leads/*`.
- **Files**: Resume handled as a **file upload**; JsonForms collects a data URL, which we convert to a `File` and append to `FormData` for the API.


## Why JsonForms
- Requirement (bonus): configuration-driven form.
- We use a **JSON Schema** + **UI Schema** to render inputs (including multi-select checkboxes for visa categories and a data-URL file control) and keep business logic in a small submit handler.


## Matching the Mockups
- **External**: multi-select visa checkboxes (O‑1, EB‑1A, EB‑2 NIW, I don’t know), added Country of Citizenship, and a **Thank You** screen after submit.
- **Internal list**: Only Name, Submitted, Status, Country — with **sortable headers**, **search**, **status filter**, **pagination**, and disabled nav arrows when there’s no page to navigate to.
- **All info**: Details page linked from the Name column.


## Tradeoffs
- In-memory DB is reset on dev restart (acceptable for a take-home).
- JsonForms vanilla renderer provides basic styling; custom CSS helps alignment.
- Double validation (AJV via JsonForms UI + Zod on submit) ensures consistency with API.


## Future Improvements
- Replace mock auth with NextAuth.
- Persist to DB (SQLite/Prisma) and store files in S3.
- Server Actions / RSC for more efficient data flow.
- E2E tests (Playwright) for form and list flows.