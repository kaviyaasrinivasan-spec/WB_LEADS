# WB Leads Application - Frontend Performance Analysis & Fixes

## 🚨 Identified Issues

### 1. **No Code Splitting** (Critical - Bundle Size)
**File:** `src/App.tsx`
All 23+ page components are imported eagerly at startup:
```typescript
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import AccountDetails from "@/pages/AccountDetails";
// ... 20+ more imports
```
**Impact:** Initial bundle is ~300KB+ of JavaScript to parse before first paint.

### 2. **Multiple Parallel API Calls** (High - Network Waterfall)
**File:** `src/pages/Accounts.tsx` (lines 66-82)
```typescript
const [accountsData, usersData, industriesData, lobsData, citiesData, stagesData] = 
  await Promise.all([...6 API calls...]);
```
**Impact:** Even though using Promise.all, this still means 6 requests that must ALL complete before rendering.

### 3. **No Virtualization for Large Lists** (High - Rendering)
**File:** `src/pages/Accounts.tsx` (line 186)
```typescript
const displayData = filteredData; // ALL records rendered at once
```
**Impact:** With 500+ accounts, the browser renders 500+ DOM nodes, causing jank.

### 4. **Inline Function References** (Medium - Re-renders)
**File:** `src/pages/LeadsTemplate.tsx`
Every row's `onValueChange` creates a new function:
```typescript
onValueChange={async (value) => { ... }}
```
**Impact:** React cannot optimize row updates, causing full table re-renders.

### 5. **Large Monolithic Components** (Medium - Maintenance + Performance)
- `LeadsTemplate.tsx`: 1,780 lines (86KB)
- `AccountDetails.tsx`: 89KB
- `Accounts.tsx`: 787 lines

---

## ✅ Recommended Fixes

### Fix 1: Add Lazy Loading to Routes (Priority: HIGH)

**File to modify:** `src/App.tsx`

```typescript
import { lazy, Suspense } from 'react';

// Lazy load all page components
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Accounts = lazy(() => import("@/pages/Accounts"));
const AccountDetails = lazy(() => import("@/pages/AccountDetails"));
const Leads = lazy(() => import("@/pages/Leads"));
const Users = lazy(() => import("@/pages/Users"));
const Stages = lazy(() => import("@/pages/Stages"));
const Settings = lazy(() => import("@/pages/Settings"));
const Sourcing = lazy(() => import("@/pages/Sourcing"));
const DataEnrichment = lazy(() => import("@/pages/DataEnrichment"));
const ProductQualification = lazy(() => import("@/pages/ProductQualification"));
const InitialConnect = lazy(() => import("@/pages/InitialConnect"));
const Telecalling = lazy(() => import("@/pages/Telecalling"));
const Demo = lazy(() => import("@/pages/Demo"));
const Discovery = lazy(() => import("@/pages/Discovery"));
const POC = lazy(() => import("@/pages/POC"));
const ProposalCommercials = lazy(() => import("@/pages/ProposalCommercials"));
const Pilot = lazy(() => import("@/pages/Pilot"));
const ClosedWon = lazy(() => import("@/pages/ClosedWon"));
const ClosedLost = lazy(() => import("@/pages/ClosedLost"));
const Reports = lazy(() => import("@/pages/Reports"));
const Meetings = lazy(() => import("@/pages/Meetings"));
const Login = lazy(() => import("@/pages/Login"));

// Add Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Wrap routes with Suspense
<Suspense fallback={<PageLoader />}>
  <Routes>
    {/* ... routes ... */}
  </Routes>
</Suspense>
```

**Expected Improvement:** 50-70% faster initial load

---

### Fix 2: Cache Master Data with React Query (Priority: HIGH)

**File to modify:** `src/lib/api.ts` - Add caching

Create a new hook `src/hooks/useMasterData.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Master data rarely changes - cache for 5 minutes
const STALE_TIME = 5 * 60 * 1000;

export function useMasterData() {
  const industries = useQuery({
    queryKey: ['industries'],
    queryFn: api.getIndustries,
    staleTime: STALE_TIME,
  });

  const users = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
    staleTime: STALE_TIME,
  });

  const stages = useQuery({
    queryKey: ['stages'],
    queryFn: api.getStages,
    staleTime: STALE_TIME,
  });

  const statuses = useQuery({
    queryKey: ['statuses'],
    queryFn: api.getStatuses,
    staleTime: STALE_TIME,
  });

  const lobs = useQuery({
    queryKey: ['lobs'],
    queryFn: api.getIndustryLOBs,
    staleTime: STALE_TIME,
  });

  const cities = useQuery({
    queryKey: ['cities'],
    queryFn: api.getCities,
    staleTime: STALE_TIME,
  });

  return {
    industries: industries.data || [],
    users: users.data || [],
    stages: stages.data || [],
    statuses: statuses.data || [],
    lobs: lobs.data || [],
    cities: cities.data || [],
    isLoading: industries.isLoading || users.isLoading || stages.isLoading,
  };
}
```

**Expected Improvement:** Master data loads once and is cached across pages

---

### Fix 3: Add Pagination to Tables (Priority: HIGH)

**File to modify:** `src/pages/Accounts.tsx`

Change line ~186 from:
```typescript
const displayData = filteredData;
```

To:
```typescript
const limit = 25; // Show 25 rows per page
const displayData = useMemo(() => {
  const startIndex = (page - 1) * limit;
  return filteredData.slice(startIndex, startIndex + limit);
}, [filteredData, page, limit]);
```

**Expected Improvement:** Only 25 rows rendered instead of 500+

---

### Fix 4: Memoize Table Rows (Priority: MEDIUM)

Create a memoized row component:

```typescript
import { memo, useCallback } from 'react';

const TableRowMemo = memo(function TableRow({ 
  row, 
  onStageChange, 
  onEdit, 
  onDelete 
}: { 
  row: Account;
  onStageChange: (id: number, stageId: number) => void;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}) {
  return (
    <tr>
      {/* ... row content ... */}
    </tr>
  );
});

// In parent component, use useCallback for handlers:
const handleStageChange = useCallback(async (leadId: number, stageId: number) => {
  await api.updateLeadStage(leadId, { stage_id: stageId });
  fetchLeads();
}, []);
```

---

### Fix 5: Add Loading Skeleton (Priority: MEDIUM)

Show a skeleton while data loads instead of blank page:

```typescript
{loading ? (
  <div className="space-y-3">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="h-12 bg-muted animate-pulse rounded" />
    ))}
  </div>
) : (
  <DataTable ... />
)}
```

---

## 📊 Performance Impact Summary

| Fix | Effort | Impact | Description |
|-----|--------|--------|-------------|
| Lazy Loading | Low | HIGH | 50-70% faster initial load |
| React Query Cache | Medium | HIGH | Eliminates redundant API calls |
| Pagination | Low | HIGH | 10x fewer DOM nodes |
| Memoized Rows | Medium | MEDIUM | Fewer re-renders |
| Loading Skeleton | Low | LOW | Better perceived performance |

---

## Quick Win: Implement Lazy Loading Now

This single change will have the biggest impact. Would you like me to apply this fix to your `App.tsx` now?
