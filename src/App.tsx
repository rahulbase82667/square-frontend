
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, useUser, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import ProductUpload from "./pages/ProductUpload";
import IntegrationsPage from "./pages/IntegrationsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import OAuthCallback from "./components/OAuthCallback";
import { ProductProvider } from "./pages/ProductContext";

const queryClient = new QueryClient();

const ALLOWED_DOMAINS = ["adalondontrading.store", "milogistix.uk"];

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  
  if (!isLoaded) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }
  
  // Check if user's email domain is allowed
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (email) {
    const domain = email.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      // Redirect unauthorized users to login
      return <Navigate to="/login" />;
    }
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ClerkLoading>
        <div className="h-screen w-full flex items-center justify-center">
          Loading authentication...
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <BrowserRouter>
          <Routes>
            <Route path="/login/*" element={<Login />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route
                path="upload"
                element={
                  <ProductProvider>
                    <ProductUpload />
                  </ProductProvider>
                }
              />
              <Route
                path="products"
                element={
                  // <ProductProvider>
                    <ProductsPage />
                  // </ProductProvider>
                }
              />
              <Route
                path="products/:id"
                element={
                  // <ProductProvider>
                    <ProductDetail />
                  // </ProductProvider>
                }
              />
              <Route path="integrations" element={<IntegrationsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ClerkLoaded>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
