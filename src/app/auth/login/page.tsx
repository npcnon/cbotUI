"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, LogInIcon } from "lucide-react";
import { useLoading } from "@/lib/loading-context";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';
  const { isLoading, setIsLoading } = useLoading();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  // Error and success states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(justRegistered ? "Account created successfully! Please sign in." : "");
  
  // Animation states
  const [mounted, setMounted] = useState(false);
  const [fadeIn, setFadeIn] = useState({
    card: "opacity-0 translate-y-4",
    title: "opacity-0",
    form: "opacity-0",
    footer: "opacity-0"
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearCookies = () => {
    // Loop through all cookies and delete them
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=;expires=${new Date(0).toUTCString()};path=/`;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Clear all cookies before logging in
    clearCookies();

    try {
      // Show loading state
      document.body.style.cursor = "wait";
      
      // Prepare the data as a JSON object
      const data = {
        username: formData.email,
        password: formData.password
      };

      // Send the request with JSON data
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/token`, data
      );

      console.log(`Login response:`, JSON.stringify(response.data));

      setSuccess("Login successful! Redirecting...");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/chat");
      }, 1000);
      
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Handle error response
      const serverMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      
      setError(serverMessage);
    } finally {
      setIsLoading(false);
      document.body.style.cursor = "default";
    }
  };



  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 p-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-900/20 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-xl transform translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      </div>

      <div className={`w-full max-w-md relative transition-all duration-700 ${fadeIn.card}`}>
        <Card className="border border-indigo-900/30 shadow-xl bg-gray-900/80 backdrop-blur-md text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1">
            {isLoading && (
              <div className="h-full bg-indigo-600 animate-progress-indeterminate"></div>
            )}
          </div>
          
          <CardHeader className={`space-y-2 text-center transition-opacity duration-500 ${fadeIn.title}`}>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-300 font-medium">
              Enter your credentials to sign in to your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className={`space-y-5 transition-opacity duration-500 ${fadeIn.form}`}>
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded-md text-sm font-medium">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-900/30 border border-green-500/50 text-green-200 rounded-md text-sm font-medium">
                  {success}
                </div>
              )}
            
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
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 pr-10 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className={`flex flex-col space-y-5 pt-3 transition-opacity duration-500 ${fadeIn.footer}`}>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogInIcon className="mr-2 h-5 w-5" /> Sign In
                  </span>
                )}
              </Button>
              
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-900 px-4 text-sm text-gray-400">or</span>
                </div>
              </div>
              
              <p className="text-center text-base font-medium text-gray-300">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        {/* Decorative elements */}
        <div className="absolute -z-10 top-1/4 left-1/4 w-32 h-32 bg-purple-600/20 rounded-full filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -z-10 top-1/3 right-1/4 w-40 h-40 bg-blue-600/20 rounded-full filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -z-10 bottom-1/4 right-1/3 w-36 h-36 bg-indigo-600/20 rounded-full filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}