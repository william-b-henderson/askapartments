import { Suspense } from 'react';
import MapContainer from '@/app/components/MapContainer';
import { getListings } from '@/app/components/ListingsData';

export default async function Home() {
  // Fetch listings data on the server
  const listings = await getListings();
  
  return (
    <main className="flex flex-col h-screen">
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">Property Listings Map</h1>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading map and listings...</div>}>
          <MapContainer listings={listings} />
        </Suspense>
      </div>
    </main>
  );
}
