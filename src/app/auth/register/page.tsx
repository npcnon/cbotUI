"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, Loader2Icon, UserPlusIcon } from "lucide-react";
import { useLoading } from "@/lib/loading-context";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegisterForm />
    </Suspense>
  );
}

// Add a proper loading fallback component (similar to login page)
function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 p-4">
      <div className="flex flex-col items-center space-y-4">
        <Loader2Icon className="h-12 w-12 text-indigo-400 animate-spin" />
        <p className="text-lg font-medium text-indigo-200">Loading registration...</p>
      </div>
    </div>
  );
}

function RegisterForm() {
  const router = useRouter();
  const { isLoading, setIsLoading } = useLoading();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  
  // Form validation state
  const [validation, setValidation] = useState({
    password: {
      isValid: false,
      message: "",
    }
  });
  
  // Error and success states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Animation states
  const [mounted, setMounted] = useState(false);
  const [fadeIn, setFadeIn] = useState({
    card: "opacity-0 translate-y-4",
    title: "opacity-0",
    form: "opacity-0",
    footer: "opacity-0"
  });
  
  // Input disabled state (like in login page)
  const [inputsDisabled, setInputsDisabled] = useState(false);

  // Initialize animations after mount
  useEffect(() => {
    setMounted(true);
    
    // Staggered animations
    const timer1 = setTimeout(() => {
      setFadeIn(prev => ({
        ...prev,
        card: "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      }));
    }, 100);
    
    const timer2 = setTimeout(() => {
      setFadeIn(prev => ({
        ...prev,
        title: "opacity-100 transition-all duration-500 ease-out"
      }));
    }, 400);
    
    const timer3 = setTimeout(() => {
      setFadeIn(prev => ({
        ...prev,
        form: "opacity-100 transition-all duration-500 ease-out"
      }));
    }, 600);
    
    const timer4 = setTimeout(() => {
      setFadeIn(prev => ({
        ...prev,
        footer: "opacity-100 transition-all duration-500 ease-out"
      }));
    }, 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Update inputs disabled state when loading changes (like login page)
  useEffect(() => {
    setInputsDisabled(isLoading);
  }, [isLoading]);

  // Validate password when it changes
  useEffect(() => {
    if (formData.password.length === 0) {
      setValidation(prev => ({
        ...prev,
        password: { isValid: false, message: "" }
      }));
    } else if (formData.password.length < 8) {
      setValidation(prev => ({
        ...prev,
        password: { isValid: false, message: "Password must be at least 8 characters long" }
      }));
    } else {
      setValidation(prev => ({
        ...prev,
        password: { isValid: true, message: "Password strength: Good" }
      }));
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setInputsDisabled(true); // Disable form inputs immediately
    setError("");
    setSuccess("");

    try {
      // Show loading state with cursor change (like login page)
      document.body.style.cursor = "wait";
      
      // Add a slight delay to make loading state more noticeable
      await new Promise(resolve => setTimeout(resolve, 300));

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/register`, {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
      }, {
        // Add timeout to prevent hanging requests
        timeout: 10000
      });

      console.log("Registration successful:", response.data);
      setSuccess("Account created successfully! Redirecting...");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/auth/login?registered=true");
      }, 1500);
    } catch (error: any) {
      console.error("Registration failed:", error);

      // Handle FastAPI's HTTPException
      const serverMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message || // fallback if detail is not used
        (error?.code === 'ECONNABORTED' ? 
          "Connection timed out. Please check your internet connection and try again." :
          "Registration failed. Please try again.");

      setError(serverMessage);
    } finally {
      setIsLoading(false);
      setInputsDisabled(false); // Re-enable inputs
      document.body.style.cursor = "default"; // Reset cursor
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 p-4 overflow-hidden">
      {/* Add loading overlay when isLoading is true - enhanced like login page */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center space-y-4 bg-gray-900/90 p-6 rounded-xl border border-indigo-500/30 shadow-2xl">
            <Loader2Icon className="h-10 w-10 text-indigo-400 animate-spin" />
            <p className="text-indigo-200 font-medium">Processing your request...</p>
          </div>
        </div>
      )}
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-900/20 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-xl transform translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      </div>

      <div className={`w-full max-w-md relative transition-all duration-700 ${fadeIn.card}`}>
        <Card className="border border-indigo-900/30 shadow-xl bg-gray-900/80 backdrop-blur-md text-white overflow-hidden">
          {/* Add progress bar loading indicator - like login page */}
          <div className="absolute top-0 left-0 w-full h-1">
            {isLoading && (
              <div className="h-full bg-indigo-600 animate-progress-indeterminate"></div>
            )}
          </div>
          
          <CardHeader className={`space-y-2 text-center transition-opacity duration-500 ${fadeIn.title}`}>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Create an account
            </CardTitle>
            <CardDescription className="text-gray-300 font-medium">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className={`space-y-5 transition-opacity duration-500 ${fadeIn.form}`}>
              {success && (
                <div className="p-3 bg-green-900/30 border border-green-500/50 text-green-200 rounded-md text-sm font-medium animate-pulse-once">
                  {success}
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded-md text-sm font-medium animate-pulse-once">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-gray-300 font-medium">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="John"
                    autoComplete="given-name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`h-12 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 ${inputsDisabled ? 'opacity-70' : ''}`}
                    disabled={inputsDisabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-gray-300 font-medium">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Doe"
                    autoComplete="family-name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`h-12 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 ${inputsDisabled ? 'opacity-70' : ''}`}
                    disabled={inputsDisabled}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-12 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 ${inputsDisabled ? 'opacity-70' : ''}`}
                  disabled={inputsDisabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`h-12 pr-10 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 ${inputsDisabled ? 'opacity-70' : ''} ${
                      formData.password && !validation.password.isValid 
                        ? "border-red-500 focus:ring-red-500" 
                        : formData.password && validation.password.isValid 
                        ? "border-green-500 focus:ring-green-500" 
                        : ""
                    }`}
                    disabled={inputsDisabled}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-3.5 text-gray-400 hover:text-gray-200 transition-colors ${inputsDisabled ? 'opacity-70 pointer-events-none' : ''}`}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={inputsDisabled}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className={`text-sm mt-1 ${
                  formData.password && !validation.password.isValid 
                    ? "text-red-400 font-medium" 
                    : formData.password && validation.password.isValid 
                    ? "text-green-400 font-medium" 
                    : "text-gray-400"
                }`}>
                  {validation.password.message || "Password must be at least 8 characters long"}
                </p>
                
                {formData.password && validation.password.isValid && (
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out" style={{width: '75%'}}></div>
                  </div>
                )}
              </div>
              
              <div className="mt-2 p-4 bg-gray-800/50 border border-gray-700 rounded-md">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreeToTerms}
                    onCheckedChange={handleCheckboxChange}
                    required
                    className="h-5 w-5 transition-all duration-200 border-2 border-indigo-500 data-[state=checked]:bg-indigo-600 text-white"
                    disabled={inputsDisabled}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium text-gray-300 leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className={`text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-semibold ${inputsDisabled ? 'pointer-events-none opacity-70' : ''}`}>
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className={`text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-semibold ${inputsDisabled ? 'pointer-events-none opacity-70' : ''}`}>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className={`flex flex-col space-y-5 pt-4 transition-opacity duration-500 ${fadeIn.footer}`}>
              <Button 
                type="submit" 
                className={`w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/30 ${isLoading ? 'animate-pulse' : ''}`}
                disabled={inputsDisabled || !formData.agreeToTerms || !validation.password.isValid}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlusIcon className="mr-2 h-5 w-5" /> Sign Up
                  </span>
                )}
              </Button>
              
              {!formData.agreeToTerms && validation.password.isValid && (
                <p className="text-center text-sm text-orange-400 font-medium -mt-2">
                  Please agree to the Terms of Service to continue
                </p>
              )}
              
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-900 px-4 text-sm text-gray-400">or</span>
                </div>
              </div>
              
              <p className="text-center text-base font-medium text-gray-300">
                Already have an account?{" "}
                <Link 
                  href="/auth/login" 
                  className={`font-semibold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline ${inputsDisabled ? 'pointer-events-none opacity-70' : ''}`}
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        {/* Decorative elements */}
        <div className="absolute -z-10 top-1/4 right-1/4 w-32 h-32 bg-blue-600/20 rounded-full filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -z-10 top-1/3 left-1/4 w-40 h-40 bg-purple-600/20 rounded-full filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -z-10 bottom-1/4 left-1/3 w-36 h-36 bg-indigo-600/20 rounded-full filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}