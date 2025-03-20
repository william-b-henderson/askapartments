'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
}

export default function Map({ 
  listings = [], 
  selectedListing, 
  onSelectListing, 
  onMapLoad 
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [DEFAULT_LONGITUDE, DEFAULT_LATITUDE],
        zoom: DEFAULT_ZOOM
      });
      
      // When map loads, call the onMapLoad callback if provided
      map.current.on('load', () => {
        setMapLoaded(true);
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
          // Add the image to the map
          map.current?.addImage('ellipse-bg', img as HTMLImageElement);
          URL.revokeObjectURL(svgUrl);
        };
        img.src = svgUrl;
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onMapLoad]);

  // Create a GeoJSON source from listings and add to map
  useEffect(() => {
    if (!map.current || !mapLoaded || !listings.length) return;

    // Create GeoJSON data from listings
    const geojson = {
      type: 'FeatureCollection',
      features: listings.map(listing => ({
        type: 'Feature',
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
          type: 'Point',
          coordinates: [listing.latLong.longitude, listing.latLong.latitude]
        }
      }))
    };

    // Add GeoJSON source to map
    if (map.current.getSource('listings')) {
      // If source already exists, update it
      (map.current.getSource('listings') as mapboxgl.GeoJSONSource).setData(geojson as any);
    } else {
      // If source doesn't exist, add it and the layers
      map.current.addSource('listings', {
        type: 'geojson',
        data: geojson as any
      });

      // Then replace your existing layers with a single symbol layer
      map.current.addLayer({
        id: 'listings-markers',
        type: 'symbol',
        source: 'listings',
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

      // Update your event handlers to use this new layer
      map.current.on('mouseenter', 'listings-markers', (e) => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
          
          // Get coordinates and properties from the feature
          const feature = e.features?.[0];
          // Type assertion to tell TypeScript this is a Point geometry
          const point = feature?.geometry as GeoJSON.Point;
          const coordinates = point?.coordinates.slice() as [number, number];
          const properties = feature?.properties;

          if (!coordinates || !properties) return;

          // Create popup content
          const popupContent = `
            <div style="max-width: 200px;">
              ${properties.imgSrc ? `<img src="${properties.imgSrc}" alt="${properties.address}" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px;">` : ''}
              <h3 style="margin: 0 0 5px; font-size: 14px;">${properties.addressStreet}</h3>
              <p style="margin: 0 0 5px; font-size: 12px;">${properties.addressCity}, ${properties.addressState} ${properties.addressZipcode}</p>
              ${properties.price ? `<p style="margin: 0; font-weight: bold; font-size: 14px;">${properties.price}</p>` : ''}
              ${properties.beds && properties.baths ? `<p style="margin: 0; font-size: 12px;">${properties.beds} BD | ${properties.baths} BA</p>` : ''}
            </div>
          `;

          // Create and show popup
          if (popupRef.current) {
            popupRef.current.remove();
          }
          popupRef.current = new mapboxgl.Popup({ 
            closeButton: false,
            closeOnClick: false,
            offset: 15
          })
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map.current);
        }
      });

      map.current.on('mouseleave', 'listings-markers', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
        }
      });

      map.current.on('click', 'listings-markers', (e) => {
        if (e.features && e.features.length > 0) {
          const properties = e.features[0].properties;
          
          if (properties) {
            const clicked = listings.find(l => l.id === properties.id);
            if (clicked) {
              onSelectListing(clicked);
            }
          }
        }
      });
    }

    // Fit map to bounds of all listings
    const bounds = new mapboxgl.LngLatBounds();
    listings.forEach(listing => {
      if (listing.latLong.longitude && listing.latLong.latitude) {
        bounds.extend([listing.latLong.longitude, listing.latLong.latitude]);
      }
    });

    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
      duration: 500
    });

  }, [listings, mapLoaded, onSelectListing]);

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

  return (
    <div className="map-wrapper">
      <div className="map-info">
        <div>Showing {listings.length} listings</div>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
} 