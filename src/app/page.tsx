"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  // Animation classes that will be applied after component mounts
  const [animationClasses, setAnimationClasses] = useState({
    container: "opacity-0",
    title: "opacity-0 translate-y-2",
    description: "opacity-0",
    buttons: "opacity-0",
    decorativeElement: "opacity-0 scale-95"
  });

  // Handle animations after mount
  useEffect(() => {
    setMounted(true);
    
    // Stagger animations
    const timer1 = setTimeout(() => {
      setAnimationClasses(prev => ({
        ...prev,
        container: "opacity-100 transition-all duration-700"
      }));
    }, 100);
    
    const timer2 = setTimeout(() => {
      setAnimationClasses(prev => ({
        ...prev,
        title: "opacity-100 translate-y-0 transition-all duration-700"
      }));
    }, 300);
    
    const timer3 = setTimeout(() => {
      setAnimationClasses(prev => ({
        ...prev,
        description: "opacity-100 transition-all duration-500"
      }));
    }, 500);
    
    const timer4 = setTimeout(() => {
      setAnimationClasses(prev => ({
        ...prev,
        buttons: "opacity-100 transition-all duration-700"
      }));
    }, 700);
    
    const timer5 = setTimeout(() => {
      setAnimationClasses(prev => ({
        ...prev,
        decorativeElement: "opacity-100 scale-100 transition-all duration-1000"
      }));
    }, 900);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-900/20 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-xl transform translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      </div>

      <div className={`w-full max-w-md text-center space-y-8 bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-indigo-900/30 transition-all duration-500 ${animationClasses.container}`}>
        <div className="space-y-4">
          <div className={`transition-all duration-500 ${animationClasses.title}`}>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Welcome to{" "}
              <span className="inline-block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                CHATBOT
              </span>
            </h1>
          </div>
          
          <p className={`text-lg text-gray-300 transition-opacity duration-500 ${animationClasses.description}`}>
            Your personal AI assistant ready to help with anything
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 ${animationClasses.buttons}`}>
          <Button asChild className="h-12 px-6 bg-indigo-600  hover:bg-indigo-50 shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95">
            <Link href="/auth/login" className="flex items-center justify-center">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In 
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-12 px-6 border-indigo-300 text-indigo-700 hover:bg-indigo-50 shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95">
            <Link href="/auth/register" className="flex items-center justify-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </Link>
          </Button>
        </div>
        
        <div className={`mt-8 flex justify-center transition-all duration-1000 ${animationClasses.decorativeElement}`}>
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full bg-blue-100 animate-pulse opacity-70"></div>
            <div className="absolute inset-2 rounded-full bg-indigo-200 animate-ping-slow opacity-70"></div>
            <div className="absolute inset-4 rounded-full bg-indigo-400 animate-pulse"></div>
            <div className="absolute inset-6 rounded-full bg-indigo-600"></div>
          </div>
        </div>

        <div className={`mt-6 text-sm text-gray-500 transition-opacity duration-500 ${animationClasses.description}`}>
          Experience the power of AI-driven conversations
        </div>
      </div>
    </main>
  );
}