'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Home, Bath, Bed, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  listing: {
    id: string;
    zpid: string;
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
  };
  isSelected?: boolean;
  onClick?: () => void;
}

export function PropertyCard({ listing, isSelected, onClick }: PropertyCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
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
        <div className="bg-muted h-48 flex items-center justify-center">
          <Home className="h-12 w-12 text-muted-foreground" />
          <span className="text-muted-foreground">No image available</span>
        </div>
      )}

      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-medium text-lg truncate">{listing.addressStreet}</h3>
            <p className="text-muted-foreground text-sm">
              {listing.addressCity}, {listing.addressState} {listing.addressZipcode}
            </p>
          </div>
          
          {listing.price && (
            <Badge variant="secondary" className="text-base whitespace-nowrap">
              {listing.price}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="flex mt-2 text-sm text-muted-foreground">
          {listing.beds && (
            <div className="flex items-center mr-4">
              <Bed className="h-4 w-4 mr-1" />
              <span>{listing.beds} BD</span>
            </div>
          )}
          
          {listing.baths && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{listing.baths} BA</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {listing.detailUrl && (
        <CardFooter className="p-4 pt-0 border-t border-border">
          <Link 
            href={listing.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            See details
            <ExternalLink className="h-4 w-4 ml-1" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
} 