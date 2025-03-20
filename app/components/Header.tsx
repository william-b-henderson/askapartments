'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);
  
  return (
    <header className="bg-card text-card-foreground shadow-sm border-b">
      <div className="container mx-auto py-5 px-6 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-3">
          <span>Property Listings Map</span>
        </Link>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  href="/" 
                  className="px-4 py-2 rounded-md hover:bg-accent"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/listings" 
                  className="px-4 py-2 rounded-md hover:bg-accent"
                  onClick={() => setOpen(false)}
                >
                  All Listings
                </Link>
                <Link 
                  href="/about" 
                  className="px-4 py-2 rounded-md hover:bg-accent"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link href="/listings" className="hover:text-primary transition">
            All Listings
          </Link>
          <Link href="/about" className="hover:text-primary transition">
            About
          </Link>
          <Button size="sm">Contact</Button>
        </nav>
      </div>
    </header>
  );
} 