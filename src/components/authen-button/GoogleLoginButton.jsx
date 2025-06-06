import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../../configs/firebase";

const GoogleLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    
    try {
      setIsLoading(true);
      setError(null);
      // Simulate authentication delay\
      const result = await signInWithPopup(auth, googleProvider);

      // The signed-in user info.
      const token = result.user.accessToken;
      console.log(token);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Add your actual Google authentication logic here
    } catch (err) {
      setError("Authentication failed. Please try again." + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={`flex items-center justify-center w-full max-w-md px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 ease-in-out ${
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-50"
        }`}
        aria-label="Sign in with Google"
      >
        <FcGoogle className="w-6 h-6 mr-3" aria-hidden="true" />
        <span className="mr-2">
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </span>
        {isLoading && (
          <svg
            className="w-5 h-5 animate-spin text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </button>
      {error && (
        <div
          className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-medium underline hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
};

export default GoogleLoginButton;
