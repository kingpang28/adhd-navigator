import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const Screening = lazy(() => import("./pages/Screening"));
const Vitals = lazy(() => import("./pages/Vitals"));
const Clinics = lazy(() => import("./pages/Clinics"));
const ReferralReport = lazy(() => import("./pages/ReferralReport"));

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/screening"} component={() => <Suspense fallback={<div>Loading...</div>}><Screening /></Suspense>} />
      <Route path={"/vitals"} component={() => <Suspense fallback={<div>Loading...</div>}><Vitals /></Suspense>} />
      <Route path={"/clinics"} component={() => <Suspense fallback={<div>Loading...</div>}><Clinics /></Suspense>} />
      <Route path={"/referral"} component={() => <Suspense fallback={<div>Loading...</div>}><ReferralReport /></Suspense>} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
