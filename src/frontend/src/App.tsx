import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { useAuth } from "./hooks/useAuth";

// Lazy-loaded pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const FoodScannerPage = lazy(() => import("./pages/FoodScannerPage"));
const MoodTrackerPage = lazy(() => import("./pages/MoodTrackerPage"));
const SymptomsPage = lazy(() => import("./pages/SymptomsPage"));
const HealthRiskPage = lazy(() => import("./pages/HealthRiskPage"));
const DietPage = lazy(() => import("./pages/DietPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

const PageFallback = () => <LoadingSpinner fullPage label="Loading..." />;

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public routes (no layout)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <LoginPage />
    </Suspense>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <RegisterPage />
    </Suspense>
  ),
});

// Protected layout route
function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return <LoadingSpinner fullPage label="Loading OceanWell..." />;
  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

// Index redirect
const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  component: () => {
    throw redirect({ to: "/dashboard" });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <DashboardPage />
    </Suspense>
  ),
});

const foodScannerRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/food-scanner",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <FoodScannerPage />
    </Suspense>
  ),
});

const moodRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/mood-tracker",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <MoodTrackerPage />
    </Suspense>
  ),
});

const symptomsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/symptoms",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <SymptomsPage />
    </Suspense>
  ),
});

const healthRiskRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/health-risk",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <HealthRiskPage />
    </Suspense>
  ),
});

const dietRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/diet-recommendations",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <DietPage />
    </Suspense>
  ),
});

const analyticsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/analytics",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <AnalyticsPage />
    </Suspense>
  ),
});

const historyRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/history",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <HistoryPage />
    </Suspense>
  ),
});

const reportRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/report",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ReportPage />
    </Suspense>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/profile",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ProfilePage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  protectedRoute.addChildren([
    indexRoute,
    dashboardRoute,
    foodScannerRoute,
    moodRoute,
    symptomsRoute,
    healthRiskRoute,
    dietRoute,
    analyticsRoute,
    historyRoute,
    reportRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
