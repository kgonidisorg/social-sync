import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Compose from "@/pages/compose";
import Schedule from "@/pages/schedule";
import Analytics from "@/pages/analytics";
import PlatformsIndex from "@/pages/platforms/index";
import PlatformDetail from "@/pages/platforms/[platform]";
import AccountSettings from "@/pages/settings/account";
import PreferencesSettings from "@/pages/settings/preferences";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/compose" component={Compose} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/platforms" component={PlatformsIndex} />
      <Route path="/platforms/:platform" component={PlatformDetail} />
      <Route path="/settings/account" component={AccountSettings} />
      <Route path="/settings/preferences" component={PreferencesSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
