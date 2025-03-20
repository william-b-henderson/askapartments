'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Initialize mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

const DEFAULT_LONGITUDE = -122.4194;
const DEFAULT_LATITUDE = 37.7749;
const DEFAULT_ZOOM = 12;

// Define the type for a listing
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

interface MapProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelectListing: (listing: Listing | null) => void;
  onMapLoad?: (mapInstance: mapboxgl.Map) => void;
  isMobile?: boolean;
}

export default function Map({ 
  listings = [], 
  selectedListing, 
  onSelectListing, 
  onMapLoad,
  isMobile = false
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (mapContainer.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12', // Use standard Mapbox style
          center: [DEFAULT_LONGITUDE, DEFAULT_LATITUDE],
          zoom: DEFAULT_ZOOM
        });
        
        // Add error event listener
        map.current.on('error', (e) => {
          console.error("Mapbox error:", e.error);
        });
        
        // When map loads, call the onMapLoad callback if provided
        map.current.on('load', () => {
          console.log("Map loaded successfully");
          if (onMapLoad && map.current) {
            onMapLoad(map.current);
          }
          
          // Create a small elliptical SVG that can be stretched
          const svgData = `
            <svg width="60" height="30" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="30" cy="15" rx="28" ry="13" fill="#c41e3a" stroke="#ffffff" stroke-width="2"/>
            </svg>
          `;

          // Create a new image for the map
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
          const svgUrl = URL.createObjectURL(svgBlob);

          // Load the SVG as an image
          const img = new Image();
          img.onload = () => {
            try {
              // Add the image to the map
              if (map.current) {
                map.current.addImage('ellipse-bg', img as HTMLImageElement);
                console.log("Added ellipse-bg image to map");
              }
              URL.revokeObjectURL(svgUrl);
            } catch (error) {
              console.error("Error adding image to map:", error);
            }
          };
          img.onerror = (error) => {
            console.error("Error loading SVG image:", error);
            URL.revokeObjectURL(svgUrl);
          };
          img.src = svgUrl;
        });

        // Add responsive controls for mobile
        if (isMobile) {
          map.current?.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
          map.current?.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          }), 'bottom-right');
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }

    return () => {
      // Only remove the map when the component is actually unmounting,
      // not when dependencies change
    };
  }, []); // Remove dependencies to ensure map initializes only once

  // Add a separate effect to handle mobile controls
  useEffect(() => {
    if (!map.current) return;
    
    // Remove existing controls
    map.current.getContainer().querySelectorAll('.mapboxgl-ctrl-group').forEach(el => {
      el.remove();
    });
    
    // Add mobile controls if needed
    if (isMobile) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }), 'bottom-right');
    }
  }, [isMobile]);

  // Add a separate cleanup effect
  useEffect(() => {
    return () => {
      if (map.current) {
        console.log("Cleaning up map on component unmount");
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Modify the GeoJSON useEffect to add more robust checking and error handling
  useEffect(() => {
    if (!map.current || !listings.length) return;

    // Add safety checks and logging
    console.log("Adding GeoJSON data to map");
    
    try {
      // Wait for map style to be fully loaded before manipulating sources
      if (!map.current.isStyleLoaded()) {
        console.log("Style not yet loaded, waiting...");
        
        // Set up a one-time event listener for the style.load event
        const onStyleLoad = () => {
          addGeoJSONSource();
          map.current?.off('style.load', onStyleLoad);
        };
        
        map.current.on('style.load', onStyleLoad);
        return;
      }
      
      // If style is already loaded, add the GeoJSON source
      addGeoJSONSource();
      
    } catch (error) {
      console.error("Error setting up GeoJSON data:", error);
    }
    
    function addGeoJSONSource() {
      try {
        // Check if the source already exists and remove it if necessary
        if (map.current?.getSource('listings-data')) {
          console.log("Source already exists, removing it first");
          // Need to remove the layer before removing the source
          if (map.current.getLayer('listings-markers')) {
            map.current.removeLayer('listings-markers');
          }
          map.current.removeSource('listings-data');
        }
        
        // Create GeoJSON data from listings
        const geojson = {
          type: 'FeatureCollection' as const,
          features: listings.map(listing => ({
            type: 'Feature' as const,
            properties: {
              id: listing.id,
              zpid: listing.zpid,
              address: listing.address,
              addressStreet: listing.addressStreet,
              addressCity: listing.addressCity,
              addressState: listing.addressState,
              addressZipcode: listing.addressZipcode,
              price: listing.price ? parseFloat(listing.price.replace(/[^0-9.]/g, '')) : 0,
              beds: listing.beds || '',
              baths: listing.baths || '',
              imgSrc: listing.imgSrc || ''
            },
            geometry: {
              type: 'Point' as const,
              coordinates: [listing.latLong.longitude, listing.latLong.latitude]
            }
          }))
        };
        
        // Add the source
        console.log("Adding source to map");
        map.current?.addSource('listings-data', {
          type: 'geojson',
          data: geojson
        });
        
        // Add the layer
        console.log("Adding layer to map");
        map.current?.addLayer({
          id: 'listings-markers',
          type: 'symbol',
          source: 'listings-data',
          layout: {
            // Price text
            'text-field': ['format',
              ['concat', '$', 
                ['number-format', 
                  ['/', ['get', 'price'], 1000], 
                  { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }
                ], 
                'K'
              ]
            ],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            
            // Elliptical background
            'icon-image': 'ellipse-bg',
            'icon-text-fit': 'both',
            'icon-text-fit-padding': [6, 10, 6, 10], // top, right, bottom, left
            'icon-allow-overlap': true,
            
            // Add symbol-sort-key to control the layering
            'symbol-sort-key': ['get', 'price'] // Lower prices will be underneath
          },
          paint: {
            'text-color': '#ffffff',
            // Add text halo to help with readability
            'text-halo-color': 'rgba(196, 30, 58, 0.7)',
            'text-halo-width': 1
          }
        });
        
        // Add event handlers for the layer
        console.log("Setting up event handlers");
        map.current?.on('mouseenter', 'listings-markers', (e) => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer';
            
            // Get coordinates and properties from the feature
            const feature = e.features?.[0];
            // Type assertion to tell TypeScript this is a Point geometry
            const point = feature?.geometry as GeoJSON.Point;
            const coordinates = point?.coordinates.slice() as [number, number];
            const properties = feature?.properties;

            if (!coordinates || !properties) return;

            // Create popup content with shadcn-like styling
            const popupContent = `
              <div style="max-width: 220px; font-family: var(--font-sans);">
                ${properties.imgSrc ? `<img src="${properties.imgSrc}" alt="${properties.address}" style="width: 100%; height: auto; border-radius: 6px; margin-bottom: 8px;">` : ''}
                <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 500;">${properties.addressStreet}</h3>
                <p style="margin: 0 0 4px; font-size: 12px; opacity: 0.7;">${properties.addressCity}, ${properties.addressState} ${properties.addressZipcode}</p>
                ${properties.price ? `<p style="margin: 0; font-weight: 600; font-size: 14px; color: var(--primary);">${properties.price}</p>` : ''}
                ${properties.beds && properties.baths ? `<p style="margin: 0; font-size: 12px; opacity: 0.8;">${properties.beds} BD | ${properties.baths} BA</p>` : ''}
              </div>
            `;

            // Create and show popup
            if (popupRef.current) {
              popupRef.current.remove();
            }
            popupRef.current = new mapboxgl.Popup({ 
              closeButton: false,
              closeOnClick: false,
              offset: 15,
              className: 'custom-popup',
              maxWidth: '240px'
            })
              .setLngLat(coordinates)
              .setHTML(popupContent)
              .addTo(map.current);
          }
        });

        map.current?.on('mouseleave', 'listings-markers', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = '';
            if (popupRef.current) {
              popupRef.current.remove();
              popupRef.current = null;
            }
          }
        });

        map.current?.on('click', 'listings-markers', (e) => {
          if (e.features && e.features.length > 0) {
            const properties = e.features[0].properties;
            
            if (properties) {
              const clicked = listings.find(l => l.id === properties.id);
              if (clicked) {
                onSelectListing(clicked);
                // On mobile, show details dialog
                if (isMobile) {
                  setShowDetails(true);
                }
              }
            }
          }
        });
        
        // Fit map to bounds
        const bounds = new mapboxgl.LngLatBounds();
        listings.forEach(listing => {
          if (listing.latLong.longitude && listing.latLong.latitude) {
            bounds.extend([listing.latLong.longitude, listing.latLong.latitude]);
          }
        });
        
        // Only fit bounds if there are coordinates to fit
        if (!bounds.isEmpty()) {
          map.current?.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 15,
            duration: 500
          });
        }
      } catch (error) {
        console.error("Error in addGeoJSONSource:", error);
      }
    }
  }, [listings, onSelectListing, isMobile]);

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update map when selectedListing changes
  useEffect(() => {
    if (map.current && selectedListing) {
      map.current.flyTo({
        center: [selectedListing.latLong.longitude, selectedListing.latLong.latitude],
        zoom: 16,
        essential: true
      });
    }
  }, [selectedListing]);

  return (
    <div className="map-wrapper rounded-lg overflow-hidden shadow-md border border-border h-full flex flex-col">
      <div ref={mapContainer} className="map-container flex-1 w-full relative">
      </div>
      
      {/* Mobile listing detail dialog */}
      {isMobile && selectedListing && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <DialogTitle className="sr-only">
              Property Details for {selectedListing.addressStreet}
            </DialogTitle>
            
            <div className="relative">
              {selectedListing.imgSrc && (
                <div className="h-48 relative">
                  <img
                    src={selectedListing.imgSrc}
                    alt={selectedListing.addressStreet}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <button
                className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                onClick={() => setShowDetails(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <CardHeader>
              <CardTitle>{selectedListing.addressStreet}</CardTitle>
              <p className="text-muted-foreground">
                {selectedListing.addressCity}, {selectedListing.addressState} {selectedListing.addressZipcode}
              </p>
              {selectedListing.price && (
                <Badge variant="secondary" className="mt-2 text-lg">
                  {selectedListing.price}
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-2">
              <div className="flex gap-4">
                {selectedListing.beds && (
                  <div className="flex items-center gap-1">
                    <Badge variant="outline">{selectedListing.beds} Beds</Badge>
                  </div>
                )}
                
                {selectedListing.baths && (
                  <div className="flex items-center gap-1">
                    <Badge variant="outline">{selectedListing.baths} Baths</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 