'use client';

import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { PropertyCard } from '@/app/components/PropertyCard';
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface ListingProps {
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
  detailUrl?: string;
}

interface ListingsDrawerProps {
  listings: ListingProps[];
  selectedListing: ListingProps | null;
  onSelectListing: (listing: ListingProps) => void;
  isMobile?: boolean;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export default function ListingsDrawer({
  listings,
  selectedListing,
  onSelectListing,
  isMobile = false,
  mobileOpen = false,
  onMobileOpenChange
}: ListingsDrawerProps) {
  // Create a map of refs for each listing
  const listingRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Scroll to selected listing when it changes
  useEffect(() => {
    if (selectedListing && listingRefs.current[selectedListing.id]) {
      listingRefs.current[selectedListing.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedListing]);

  const listingsContent = (
    <>
      <div className="p-2 border-b">
        <p className="text-sm text-muted-foreground mt-1">{listings.length} properties found</p>
      </div>

      <ScrollArea className="flex-1 h-[calc(100%-70px)]">
        {listings.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No listings available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                ref={el => { listingRefs.current[listing.id] = el; }}
                className="pb-1"
              >
                <PropertyCard 
                  listing={listing}
                  isSelected={selectedListing?.id === listing.id}
                  onClick={() => onSelectListing(listing)}
                />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  );

  // Mobile view uses Sheet component
  if (isMobile) {
    return (
          <div className="flex flex-col h-full">
            {listingsContent}
          </div>
    );
  }

  // Desktop view
  return (
    <div className="w-full md:w-96 bg-card border-l border-border flex flex-col h-full overflow-hidden">
      {listingsContent}
    </div>
  );
} 