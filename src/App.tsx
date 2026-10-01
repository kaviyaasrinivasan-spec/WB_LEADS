import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Lazy load all page components for better initial load performance
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
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading spinner component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - cache API responses
      gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
      refetchOnWindowFocus: false, // Don't refetch on tab focus
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
              <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
              <Route path="/accounts/:id" element={<ProtectedRoute><AccountDetails /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/stages" element={<ProtectedRoute><Stages /></ProtectedRoute>} />
              <Route path="/sourcing" element={<ProtectedRoute><Sourcing /></ProtectedRoute>} />
              <Route path="/data-enrichment" element={<ProtectedRoute><DataEnrichment /></ProtectedRoute>} />
              <Route path="/product-qualification" element={<ProtectedRoute><ProductQualification /></ProtectedRoute>} />
              <Route path="/telecalling" element={<ProtectedRoute><Telecalling /></ProtectedRoute>} />
              <Route path="/initial-connect" element={<ProtectedRoute><InitialConnect /></ProtectedRoute>} />
              <Route path="/demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} />
              <Route path="/discovery" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
              <Route path="/poc" element={<ProtectedRoute><POC /></ProtectedRoute>} />
              <Route path="/proposal-commercials" element={<ProtectedRoute><ProposalCommercials /></ProtectedRoute>} />
              <Route path="/pilot" element={<ProtectedRoute><Pilot /></ProtectedRoute>} />
              <Route path="/closed-won" element={<ProtectedRoute><ClosedWon /></ProtectedRoute>} />
              <Route path="/closed-lost" element={<ProtectedRoute><ClosedLost /></ProtectedRoute>} />
              <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
