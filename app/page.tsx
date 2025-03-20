import { Suspense } from 'react';
import MapContainer from '@/app/components/MapContainer';
import { getListings } from '@/app/components/ListingsData';
import { Header } from '@/app/components/Header';
import { Skeleton } from '@/components/ui/skeleton';

export default async function Home() {
  // Fetch listings data on the server
  const listings = await getListings();
  
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="space-y-4 w-full max-w-5xl">
              <Skeleton className="h-[50vh] w-full" />
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-24 w-full md:w-1/3" />
                <Skeleton className="h-24 w-full md:w-1/3" />
                <Skeleton className="h-24 w-full md:w-1/3" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        }>
          <MapContainer listings={listings} />
        </Suspense>
      </div>
    </main>
  );
}
