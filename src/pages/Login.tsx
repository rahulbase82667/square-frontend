
import { useEffect } from "react";
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const Login = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already signed in
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Reginald</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        
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
