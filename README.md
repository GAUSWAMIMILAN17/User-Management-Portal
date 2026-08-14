# User Management & Project/Task Portal

A clean, scalable **Warehouse Project & Task Management Dashboard** built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase PostgreSQL** (with Row Level Security).

---

## 💡 Project Approach

The application is engineered specifically for **Warehouse Managers** to manage projects and track operational tasks efficiently. The architecture is designed around four core principles:

1. **Compound Component Architecture**: Components such as `Card`, `Modal`, `StatusBadge`, and `MetricCard` strictly implement the Compound Components pattern (e.g. `<Card.Header>`, `<Card.Body>`, `<Card.Footer>`). This encapsulates layout logic while keeping components reusable and clean.
2. **Predictable State Management**: Uses the **React Context API** (`AuthContext`, `ProjectContext`, `ThemeContext`) alongside custom hooks (`useAuth`, `useProjects`, `useDebounce`, `useTheme`). Redux overhead is avoided while maintaining global state synchronization.
3. **Performance Optimization**: Fast debounced search input filtering (`useDebounce`) and memoized progress calculation (`useMemo`) guarantee smooth 60fps UI responsiveness without unnecessary re-renders.
4. **Security & Multi-Tenancy**: Data access is secured at the database layer using Supabase PostgreSQL **Row Level Security (RLS)**, ensuring users only access their own private projects and tasks.

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Step 1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/GAUSWAMIMILAN17/User-Management-Portal.git
cd User-Management-Portal
npm install
```

### Step 2: Configure Environment Variables (Optional for Live Supabase)
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(Note: If environment variables are omitted, the application runs on a persistent local storage engine out-of-the-box for instant preview).*

### Step 3: Database Setup (Supabase PostgreSQL)
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Run the SQL migration script from [`supabase/schema.sql`](file:///c:/Users/Milan%20Gauswami/OneDrive/Desktop/Task/supabase/schema.sql).
3. This creates `profiles`, `projects`, and `tasks` tables with RLS policies and user registration triggers.

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 5: Build for Production
```bash
npm run build
```

---

## 🌐 Vercel Deployment Process

### 1. Push Code to GitHub
To push all latest changes to GitHub:
```bash
git add .
git commit -m "Configure Vercel SPA routing and environment setup"
git push origin main
```

### 2. Deploy on Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository: `GAUSWAMIMILAN17/User-Management-Portal`.
4. Vercel will automatically detect **Vite** framework settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Add Environment Variables** (under *Environment Variables* section in Vercel):
   - Key: `VITE_SUPABASE_URL` | Value: `your_supabase_url`
   - Key: `VITE_SUPABASE_ANON_KEY` | Value: `your_supabase_anon_key`
6. Click **"Deploy"**. Vercel will build and publish your project live in seconds!

*(SPA Routing configuration is pre-configured via `vercel.json` so refreshing routes like `/dashboard` or `/login` never returns 404).*

---

## 🧠 Key Logic

### 1. Real-Time Progress Calculation (`useMemo`)
Overall project completion progress `(Completed Tasks / Total Tasks) * 100` and individual project task completion statistics are computed inside `ProjectContext.tsx` using `useMemo`:
```typescript
const overallStats = useMemo(() => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return { totalTasks, completedTasks, progressPercent };
}, [tasks]);
```
This guarantees that progress percentages and progress bars update **instantly** whenever a task checkbox or status is updated.

### 2. Fast Debounced Search (`useDebounce`)
Search queries entered by the manager are passed through a custom `useDebounce` hook (300ms delay) before filtering the project list. This eliminates lag during typing:
```typescript
const debouncedSearchQuery = useDebounce(searchQuery, 300);
```

### 3. Authentication & Protected Routes
- **Route Guard (`ProtectedRoute.tsx`)**: Intercepts unauthenticated navigation attempts to `/dashboard` and redirects users to `/login`.
- **Role Enforcement**: User sign-ups are fixed exclusively to the **Warehouse Manager** role.

### 4. Interactive Project & Task Actions
- **Task Status Cycling**: Clickable checkboxes/buttons transition task status between `Pending` ➔ `In-Progress` ➔ `Completed`.
- **Project Status & Priority Dropdowns**: Interactive header selectors permit instant updates to project status or priority level.
- **Two-Step Inline Deletion**: Replaces native browser popups with an interactive `"Delete?"` check/cancel prompt for 100% reliable deletion across all browsers.

---

## 🏗️ Implementation Details

### Directory Structure
```
Task/
├── supabase/
│   └── schema.sql             # SQL Migration script with RLS policies & triggers
├── src/
│   ├── components/
│   │   ├── compound/          # Compound UI Components (Card, Modal, StatusBadge, MetricCard)
│   │   ├── common/            # Common UI (Skeleton, LoadingSpinner, ToastNotification, ThemeToggle)
│   │   ├── auth/              # Auth Screens (LoginForm, SignUpForm, ProtectedRoute)
│   │   ├── dashboard/         # Dashboard Views (Header, SummaryProgress, FilterBar, ProjectCard, TaskItem)
│   │   └── forms/             # Modal Dialog Forms (ProjectModal, TaskModal)
│   ├── contexts/              # Context Providers (AuthContext, ProjectContext, ThemeContext)
│   ├── hooks/                 # Custom Hooks (useAuth, useProjects, useDebounce, useTheme)
│   ├── services/              # API Clients (supabase.ts, mockStorage.ts)
│   ├── types/                 # TypeScript Interfaces (index.ts)
│   ├── utils/                 # Zod Schemas & Helper Formatters (schemas.ts, formatters.ts)
│   ├── App.tsx                # Routing & Provider Hierarchy
│   ├── index.css              # Tailwind CSS Styling Engine
│   └── main.tsx               # DOM Mounting Entry Point
├── .env.example               # Environment Variables Template
├── vercel.json                # Vercel Single Page App rewrite configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Form Handling & Validation
All forms (Login, Registration, Project Creation/Edit, Task Creation) use `react-hook-form` paired with `@hookform/resolvers/zod` for type-safe client-side validation.

### Feedback & Loading UX
- **Loading State**: Displays animated shimmer skeleton loaders (`Skeleton.tsx`) while fetching data.
- **Empty State**: Renders a dedicated `"No items found"` view with a **Reset Filters** button when search queries return zero matches.
- **Alert Notifications**: Displays toast notifications (`ToastNotification.tsx`) for immediate action confirmation or error messages.
