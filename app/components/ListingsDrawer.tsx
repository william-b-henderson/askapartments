'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
}

export default function ListingsDrawer({
  listings,
  selectedListing,
  onSelectListing
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

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Available Listings</h2>
        <p className="text-sm text-gray-500 mt-1">{listings.length} properties found</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {listings.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No listings available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                ref={el => { listingRefs.current[listing.id] = el; }}
                className={`
                  border rounded-lg overflow-hidden shadow-sm hover:shadow-md 
                  transition-all duration-200 cursor-pointer
                  ${selectedListing?.id === listing.id ? 'ring-2 ring-red-500' : ''}
                `}
                onClick={() => onSelectListing(listing)}
              >
                {listing.imgSrc ? (
                  <div className="relative h-48 w-full">
                    <img
                      src={listing.imgSrc}
                      alt={listing.addressStreet}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{listing.addressStreet}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {listing.addressCity}, {listing.addressState} {listing.addressZipcode}
                  </p>
                  
                  {listing.price && (
                    <p className="text-red-500 font-bold text-lg mt-2">{listing.price}</p>
                  )}
                  
                  <div className="flex mt-2 text-sm text-gray-600">
                    {listing.beds && (
                      <div className="flex items-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{listing.beds} BD</span>
                      </div>
                    )}
                    
                    {listing.baths && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{listing.baths} BA</span>
                      </div>
                    )}
                  </div>
                  
                  {listing.detailUrl && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Link 
                        href={listing.detailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                      >
                        See details
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 ml-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 