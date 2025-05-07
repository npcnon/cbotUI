"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  // Animation classes that will be applied after component mounts
  const [animationClasses, setAnimationClasses] = useState({
    container: "opacity-0 translate-y-4",
    title: "opacity-0 -translate-y-4",
    titleAccent: "",
    description: "opacity-0",
    buttons: "opacity-0 translate-y-4",
    decorativeElement: "opacity-0"
  });

  // Handle animations after mount
  useEffect(() => {
    setMounted(true);
    
    // Stagger animations
    const timer1 = setTimeout(() => {
      setAnimationClasses(prev => ({
        ...prev,
        container: "opacity-100 translate-y-0 transition-all duration-600"
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
        titleAccent: "animate-pulse"
      }));
    }, 500);
    
    const timer4 = setTimeout(() => {
      setAnimationClasses(prev => ({
        ...prev,
        description: "opacity-100 transition-all duration-700"
      }));
    }, 500);
    
    const timer5 = setTimeout(() => {
      setAnimationClasses(prev => ({
        ...prev,
        buttons: "opacity-100 translate-y-0 transition-all duration-700"
      }));
    }, 800);
    
    const timer6 = setTimeout(() => {
      setAnimationClasses(prev => ({
        ...prev,
        decorativeElement: "opacity-100 transition-all duration-700"
      }));
    }, 1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden">
      <div className={`w-full max-w-md text-center space-y-8 transition-all duration-500 ${animationClasses.container}`}>
        <div className="space-y-2">
          <div className={`transition-all duration-500 ${animationClasses.title}`}>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Welcome to{" "}
              <span className={`text-indigo-600 inline-block ${animationClasses.titleAccent}`}>
                CHATBOT
              </span>
            </h1>
          </div>
          
          <p className={`text-lg text-gray-600 transition-opacity duration-500 ${animationClasses.description}`}>
            Get started by signing in to your account or creating a new one
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 ${animationClasses.buttons}`}>
          <div className="transform transition-transform duration-200 hover:scale-105 active:scale-95">
            <Button asChild className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700">
              <Link href="/auth/login" className="flex items-center">
                Sign In 
                <span className="ml-2 inline-block animate-bounce-x">
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </Link>
            </Button>
          </div>
          
          <div className="transform transition-transform duration-200 hover:scale-105 active:scale-95">
            <Button asChild variant="outline" className="h-11 px-6">
              <Link href="/auth/register">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
        
        <div className={`mt-12 flex justify-center transition-opacity duration-500 ${animationClasses.decorativeElement}`}>
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full bg-indigo-200 animate-ping-slow opacity-50"></div>
            <div className="absolute inset-2 rounded-full bg-indigo-300 animate-ping-medium opacity-60"></div>
            <div className="absolute inset-4 rounded-full bg-indigo-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}