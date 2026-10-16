import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Home from "@/pages/Home";

const NotFound = lazy(() => import("@/pages/not-found"));
const ProductPage1 = lazy(() => import("@/pages/ProductPage1"));
const ProductPage2 = lazy(() => import("@/pages/ProductPage2"));
const ProductPage3 = lazy(() => import("@/pages/ProductPage3"));
const ProductPage4 = lazy(() => import("@/pages/ProductPage4"));
const ProductPage5 = lazy(() => import("@/pages/ProductPage5"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy"));
const DailyResetTrackerPage = lazy(() => import("@/pages/DailyResetTrackerPage"));
const WhatYouGet = lazy(() => import("@/pages/WhatYouGet"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const AgentDashboard = lazy(() => import("@/pages/AgentDashboard"));

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div
        className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        aria-label="Loading page"
      />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/quiz" component={Quiz}/>
        <Route path="/what-you-get" component={WhatYouGet}/>
        <Route path="/checkout" component={Checkout}/>
        <Route path="/payment-success" component={PaymentSuccess}/>
        <Route path="/success" component={PaymentSuccess}/>
        <Route path="/login" component={Login}/>
        <Route path="/admin/agent" component={AgentDashboard}/>
        
        {/* Protected Routes - Require Authentication */}
        <ProtectedRoute path="/dashboard" component={Dashboard}/>
        <ProtectedRoute path="/product/reset/welcome" component={ProductPage1}/>
        <ProtectedRoute path="/product/reset/morning" component={ProductPage2}/>
        <ProtectedRoute path="/product/reset/midday" component={ProductPage3}/>
        <ProtectedRoute path="/product/reset/afternoon" component={ProductPage4}/>
        <ProtectedRoute path="/product/reset/evening" component={ProductPage4}/>
        <ProtectedRoute path="/product/reset/reflection" component={ProductPage5}/>
        <Route path="/daily-reset-tracker" component={DailyResetTrackerPage}/>
        
        {/* Public Pages */}
        <Route path="/about" component={About}/>
        <Route path="/contact" component={Contact}/>
        <Route path="/refund-policy" component={RefundPolicy}/>
        <Route path="/privacy-policy" component={PrivacyPolicy}/>
        <Route path="/terms-of-service" component={TermsOfService}/>
        <Route path="/cookie-policy" component={CookiePolicy}/>
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
