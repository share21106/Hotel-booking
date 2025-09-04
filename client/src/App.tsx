import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
import { Header } from "@/components/Header";

import { Homepage } from "@/pages/Homepage";
import { Dashboard } from "@/pages/Dashboard";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={Homepage} />
      <Route path="/dashboard" component={Dashboard} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Router />
    </div>
  );
}

function App() {
  const auth = useAuthProvider();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthContext.Provider value={auth}>
          <Toaster />
          <AppContent />
        </AuthContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
