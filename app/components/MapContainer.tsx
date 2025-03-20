'use client';

import React, { useState, useEffect } from 'react';
import Map from './Map';
import ListingsDrawer from './ListingsDrawer';
import { MobileControls } from './MobileControls';
import { useMediaQuery } from '@/hooks/use-media-query';
import { PropertyCard } from '@/app/components/PropertyCard';

// Define the Listing type to match what's used in other components
interface Listing {
  zpid: string;
  id: string;
  address: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  price?: string;
  beds?: number | string;
  baths?: number | string;
  latLong: {
    latitude: number;
    longitude: number;
  };
  imgSrc?: string;
}

interface MapContainerProps {
  listings: Listing[];
}

export default function MapContainer({ listings }: MapContainerProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mapRef, setMapRef] = useState<mapboxgl.Map | null>(null);
  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');
  const [listingsOpen, setListingsOpen] = useState(false);
  
  // Check if viewport is mobile
  const isMobile = !useMediaQuery("(min-width: 768px)");
  
  // When a listing is selected from drawer, update map
  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    
    // If we have a map reference, fly to the selected listing
    if (mapRef && listing.latLong.latitude && listing.latLong.longitude) {
      mapRef.flyTo({
        center: [listing.latLong.longitude, listing.latLong.latitude],
        zoom: 16,
        essential: true
      });
    }
    
    // On mobile, after selecting a listing, open the listings drawer
    if (isMobile) {
      setListingsOpen(true);
    }
  };
  
  // Handle mobile view changes
  const handleViewChange = (view: 'map' | 'list') => {
    setCurrentView(view);
    if (view === 'list') {
      setListingsOpen(true);
    }
  };
  
  // Reset view when switching between mobile and desktop
  useEffect(() => {
    if (!isMobile) {
      setCurrentView('map');
      setListingsOpen(false);
    }
  }, [isMobile]);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Show map or list based on current view */}
        {currentView === 'map' && (
          <div className="flex-1 relative">
            <Map 
              listings={listings} 
              selectedListing={selectedListing}
              onSelectListing={setSelectedListing}
              onMapLoad={setMapRef}
              isMobile={true}
            />
          </div>
        )}
        
        {currentView === 'list' && (
          <ListingsDrawer 
          listings={listings}
          selectedListing={selectedListing}
          onSelectListing={handleSelectListing}
          isMobile={true}
          mobileOpen={listingsOpen}
          onMobileOpenChange={setListingsOpen}
        />
        )}
        
        {/* Mobile controls */}
        <MobileControls 
          onViewChange={handleViewChange}
          currentView={currentView}
        />
        
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex-1 relative">
        <Map 
          listings={listings} 
          selectedListing={selectedListing}
          onSelectListing={setSelectedListing}
          onMapLoad={setMapRef}
          isMobile={false}
        />
      </div>
      
      <ListingsDrawer 
        listings={listings}
        selectedListing={selectedListing}
        onSelectListing={handleSelectListing}
        isMobile={false}
      />
    </div>
  );
} 