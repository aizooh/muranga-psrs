# Murang'a County Infrastructure Reporting Platform

A modern, full-stack civic technology web application that allows citizens to report infrastructure issues (potholes, water leaks, broken streetlights) and allows county administrators to manage and resolve them. 

Built for the Murang'a County context, utilizing local sub-counties, landmarks, and severe weather considerations.

## 🚀 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (Local) / LibSQL & Turso (Production)
- **ORM:** Prisma
- **Auth:** JWT via `jose` + `bcryptjs`
- **Validation:** Zod

## ✨ Core Features
- **Citizen Portal:** Secure registration and login with strict password requirements (enforced real-time on the UI).
- **Detailed Reporting:** Citizens can submit requests with Title, Category, Sub-County, Location, Closest Landmark, Severity, Description, and an optional Photo upload.
- **Admin Dashboard:** Beautiful KPI cards showing Open vs. Resolved cases, Resolution Rate, and a searchable/filterable data table.
- **Status Tracking:** Immutable event log tracking requests through Pending → In Progress → Resolved, complete with admin notes.
- **Mobile Responsive:** Fully optimized for mobile devices and feature phones.

## 🏆 Bonus Features
1. **USSD Simulator UI:** A visual widget on the homepage demonstrating how feature-phone users would access the service via `*384*55#`.
2. **Public Tracking:** Any user can track a request using just the reference number (e.g., `SR-MUR-A1B2`) without logging in.
3. **Admin CSV Export:** Admins can download a full spreadsheet report of all county issues.
4. **Real-time Search & Filtering:** Query the database by status, location, or reference number.
5. **Smart Severity Tagging:** Color-coded badges (Red for Critical, Orange for High) to help admins prioritize.
6. **Event Timeline:** A full audit trail of every status change and admin note.

## 🛠️ Local Setup

1. **Clone & Install:**
   ```bash
   git clone <your-repo-link>
   cd psrs
   pnpm install