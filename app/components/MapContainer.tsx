'use client';

import React, { useState } from 'react';
import Map from './Map';
import ListingsDrawer from './ListingsDrawer';

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

  // Handle selecting a listing from the drawer
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
  };

  return (
    <>
      {/* Map Component */}
      <div className="flex-1 relative">
        <Map 
          listings={listings} 
          selectedListing={selectedListing}
          onSelectListing={setSelectedListing}
          onMapLoad={setMapRef}
        />
      </div>
      
      {/* Listings Drawer */}
      <ListingsDrawer 
        listings={listings}
        selectedListing={selectedListing}
        onSelectListing={handleSelectListing}
      />
    </>
  );
} 