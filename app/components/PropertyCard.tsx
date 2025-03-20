"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Home, Bath, Bed, ExternalLink, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  listing: {
    id: string
    zpid: string
    address: string
    addressStreet: string
    addressCity: string
    addressState: string
    addressZipcode: string
    price?: string
    beds?: number | string
    baths?: number | string
    latLong: {
      latitude: number
      longitude: number
    }
    imgSrc?: string
    detailUrl?: string
  }
  isSelected?: boolean
  onClick?: () => void
}

export function PropertyCard({ listing, isSelected, onClick }: PropertyCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 cursor-pointer group",
        "border-0 rounded-xl shadow-sm hover:shadow-xl",
        "bg-white dark:bg-black/90 backdrop-blur-sm",
        "transform-gpu hover:-translate-y-1",
        isSelected && "ring-2 ring-primary/70 shadow-lg shadow-primary/10",
      )}
      onClick={onClick}
    >
      {listing.imgSrc ? (
        <div className="relative h-56 w-full overflow-hidden rounded-t-xl">
          <img
            src={listing.imgSrc || "/placeholder.svg"}
            alt={listing.addressStreet}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {listing.price && (
            <div className="absolute bottom-4 left-4">
              <Badge
                variant="secondary"
                className="text-base font-medium tracking-tight whitespace-nowrap px-4 py-1.5 shadow-md bg-white/90 dark:bg-black/80 backdrop-blur-md text-primary dark:text-primary-foreground rounded-full"
              >
                {listing.price}
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted h-56 flex flex-col items-center justify-center rounded-t-xl">
          <Home className="h-12 w-12 text-muted-foreground mb-2" />
          <span className="text-muted-foreground text-sm">No image available</span>
          {listing.price && (
            <Badge
              variant="secondary"
              className="mt-3 text-base font-medium tracking-tight whitespace-nowrap px-4 py-1.5 rounded-full"
            >
              {listing.price}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="p-6 pb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-xl leading-tight tracking-tight">{listing.addressStreet}</h3>
          <div className="flex items-center mt-2 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
            <p className="tracking-wide">
              {listing.addressCity}, {listing.addressState} {listing.addressZipcode}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-3 pb-6">
        <div className="flex justify-between items-center mt-4">
          <div className="flex text-sm font-medium">
            {listing.beds && (
              <div className="flex items-center mr-6 bg-primary/5 dark:bg-primary/10 px-3 py-1.5 rounded-full">
                <Bed className="h-4 w-4 mr-2 text-primary/80" />
                <span>
                  {listing.beds} <span className="text-xs font-normal text-muted-foreground ml-0.5">BD</span>
                </span>
              </div>
            )}

            {listing.baths && (
              <div className="flex items-center bg-primary/5 dark:bg-primary/10 px-3 py-1.5 rounded-full">
                <Bath className="h-4 w-4 mr-2 text-primary/80" />
                <span>
                  {listing.baths} <span className="text-xs font-normal text-muted-foreground ml-0.5">BA</span>
                </span>
              </div>
            )}
          </div>

          {listing.detailUrl && (
            <Link
              href={listing.detailUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors relative overflow-hidden group-hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-primary after:w-0 after:transition-all after:duration-300"
            >
              <span className="relative z-10">View details</span>
              <ExternalLink className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5 relative z-10" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

