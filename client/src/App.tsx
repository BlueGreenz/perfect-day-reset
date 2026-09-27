import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import ProductPage1 from "@/pages/ProductPage1";
import ProductPage2 from "@/pages/ProductPage2";
import ProductPage3 from "@/pages/ProductPage3";
import ProductPage4 from "@/pages/ProductPage4";
import ProductPage5 from "@/pages/ProductPage5";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import RefundPolicy from "@/pages/RefundPolicy";
import DailyResetTrackerPage from "@/pages/DailyResetTrackerPage";
import WhatYouGet from "@/pages/WhatYouGet";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import Contact from "@/pages/Contact";
import About from "@/pages/About";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/what-you-get" component={WhatYouGet}/>
      <Route path="/checkout" component={Checkout}/>
      <Route path="/payment-success" component={PaymentSuccess}/>
      <Route path="/success" component={PaymentSuccess}/>
      <Route path="/login" component={Login}/>
      
      {/* Protected Routes - Require Authentication */}
      <ProtectedRoute path="/dashboard" component={Dashboard}/>
      <ProtectedRoute path="/product/reset/welcome" component={ProductPage1}/>
      <ProtectedRoute path="/product/reset/morning" component={ProductPage2}/>
      <ProtectedRoute path="/product/reset/midday" component={ProductPage3}/>
      <ProtectedRoute path="/product/reset/afternoon" component={ProductPage4}/>
      <ProtectedRoute path="/product/reset/reflection" component={ProductPage5}/>
      <ProtectedRoute path="/daily-reset-tracker" component={DailyResetTrackerPage}/>
      
      {/* Public Pages */}
      <Route path="/about" component={About}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/refund-policy" component={RefundPolicy}/>
      <Route path="/privacy-policy" component={PrivacyPolicy}/>
      <Route path="/terms-of-service" component={TermsOfService}/>
      <Route path="/cookie-policy" component={CookiePolicy}/>
      
      <Route component={NotFound} />
    </Switch>
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
