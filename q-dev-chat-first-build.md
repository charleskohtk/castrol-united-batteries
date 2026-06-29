I am building a Castrol Battery Warranty Registration Portal using Next.js (App Router, TypeScript) and AWS Amplify Gen 2 (code-first DX). 

I have create a new directory (castrol-warranty) and did the initial install of Next.js using terminal: ‘npx create-next-app@latest my-app --yes’ 

I need you to help me design and generate the core backend files for this project under the Amplify Gen 2 file structure (`amplify/auth/resource.ts`, `amplify/data/resource.ts`, and `amplify/backend.ts`).

### Project Overview
The portal manages automotive battery warranties for Castrol. It requires strict Multi-Tenant/Role-Based Access Control (RBAC). 

### User Roles &amp; Permissions:
1. Customers: Can register their own battery warranties, view their active warranties, and view past claim history.
2. Dealers: Can register warranties on behalf of customers and view histories of warranties they registered.
3. Workshops: Can look up active warranties by Serial Number / Customer ID and submit warranty claims for broken batteries.
4. Sales Personnel: Can view and monitor all battery registrations within their assigned regions.
5. Management: Can view high-level read-only dashboards, reports, and analytics.
6. Administrators: Full CRUD access over batteries, products, claims, users, and system configurations.

### Core Data Entities &amp; Fields Required:
- UserProfile: id, email, name, role (Enum), regionalAssignment, workshopOrDealerId (optional).
- BatteryProduct: id, modelNumber, batteryType, capacity, warrantyPeriodMonths, status (Active/Discontinued).
- WarrantyRegistration: id, serialNumber, purchaseDate, expiryDate, customerName, customerEmail, customerPhone, invoiceNumber, status (Active/Expired/Voided), registeredBy (UserId), dealerId (optional).
- WarrantyClaim: id, warrantyRegistrationId, workshopId, failureDate, claimDate, failureDescription, status (Pending/Approved/Rejected), resolutionDetails, adminNotes.

Please provide clean, production-ready TypeScript code following AWS Amplify Gen 2 best practices.

---

I'll set up the Amplify Gen 2 backend for your Castrol Battery Warranty Registration Portal. Let me first check the current project structure.

---

Good. I see the fresh Next.js project. Now I'll create the Amplify Gen 2 directory structure. Let me first create the directories and then the three core backend files.

---

Creating the Amplify Gen 2 directory structure

---

shell

---

Now I'll create the three core backend files:

---

Creating the Amplify Gen 2 auth resource with Cognito configuration for multi-role access

---

Creating the data resource with all entities and RBAC authorization rules

---

Creating the backend entry point that ties auth and data together

---


All three files are created. Here's a summary of the architecture:

### File Structure
```
amplify/
├── auth/resource.ts    — Cognito auth with email login + 6 user groups
├── data/resource.ts    — AppSync GraphQL schema with 4 models + RBAC
└── backend.ts          — Entry point wiring auth + data
```

### Key Design Decisions

**Auth (`amplify/auth/resource.ts`):**
- Email-based login via Cognito
- 6 Cognito groups matching your roles (ADMIN, MANAGEMENT, SALES, WORKSHOP, DEALER, CUSTOMER)
- Custom attributes for role, region, and workshop/dealer association

**Data (`amplify/data/resource.ts`):**
- 4 enums for type-safe role/status fields
- 4 models with field-level typing and required constraints
- Secondary indexes on `serialNumber`, `registeredBy`, `dealerId`, `warrantyRegistrationId`, and `workshopId` for efficient lookups
- Group-based authorization rules per your RBAC requirements:
  - **Customers** — owner-based access to their own registrations/claims
  - **Dealers** — can create + read warranty registrations
  - **Workshops** — can read registrations and create/read claims
  - **Sales/Management** — read-only across registrations and claims
  - **Admin** — full CRUD on everything

**Backend (`amplify/backend.ts`):**
- Minimal entry point combining auth and data resources

### Next Step
You'll need to install the Amplify dependencies:
```bash
npm add aws-amplify @aws-amplify/backend
```

Then you can run `npx ampx sandbox` to deploy a personal development backend and start building your frontend against it.