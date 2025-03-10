
import { useEffect, useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ALLOWED_DOMAINS = ["adalondontrading.store", "milogistix.uk"];

const Login = () => {
  const { isSignedIn, userId } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to dashboard if already signed in
    if (isSignedIn) {
      // Check if user's email domain is allowed
      const checkEmailDomain = async () => {
        try {
          const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}`,
              'Content-Type': 'application/json',
            }
          }).then(res => res.json());
          
          const email = user?.email_addresses?.[0]?.email_address;
          
          if (email) {
            const domain = email.split('@')[1];
            if (ALLOWED_DOMAINS.includes(domain)) {
              navigate("/");
            } else {
              // Sign out unauthorized users
              setAuthError("Your email domain is not authorized to access this application.");
            }
          }
        } catch (error) {
          console.error("Error checking email domain:", error);
        }
      };
      
      checkEmailDomain();
    }
  }, [isSignedIn, navigate, userId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Reginald</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Only authorized accounts and domains are allowed access
            </p>
          </div>
        </div>
        
        {authError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        
        <div className="mt-8">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full mx-auto",
                card: "shadow-none p-0",
              }
            }}
            path="/login"
            routing="path"
            signUpUrl="/sign-up"
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
