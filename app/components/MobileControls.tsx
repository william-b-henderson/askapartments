'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Map, List, SlidersHorizontal } from "lucide-react";

interface MobileControlsProps {
  onViewChange: (view: 'map' | 'list') => void;
  currentView: 'map' | 'list';
}

export function MobileControls({ onViewChange, currentView }: MobileControlsProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  return (
    <div className="fixed bottom-4 left-0 right-0 z-10 flex justify-center md:hidden">
      <div className="bg-background/80 backdrop-blur-md rounded-full border shadow-md p-1 flex items-center">
        <Button
          variant={currentView === 'map' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-full"
          onClick={() => onViewChange('map')}
        >
          <Map className="h-4 w-4 mr-2" />
          Map
        </Button>
        
        <Button
          variant={currentView === 'list' ? 'default' : 'ghost'} 
          size="sm"
          className="rounded-full"
          onClick={() => onViewChange('list')}
        >
          <List className="h-4 w-4 mr-2" />
          List
        </Button>
        
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full ml-1">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">Filter Properties</h3>
              {/* Filter UI would go here */}
              <div className="space-y-4">
                <p className="text-muted-foreground">Price, beds, baths filters would go here</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
} 