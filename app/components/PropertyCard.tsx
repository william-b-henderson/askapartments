"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, Bath, Bed, ExternalLink, MapPin, Heart, Share2, Info } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Share functionality would go here
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "group relative overflow-hidden border-0 rounded-2xl",
          "bg-white dark:bg-zinc-900",
          "transition-all duration-500 ease-out",
          "shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.12)]",
          "transform-gpu hover:-translate-y-1",
          isSelected && "ring-2 ring-primary shadow-primary/10",
        )}
        onClick={onClick}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {listing.imgSrc ? (
            <div className="relative h-full w-full">
              <Image
                src={listing.imgSrc || "/placeholder.svg"}
                alt={listing.addressStreet}
                fill
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
              <Home className="h-16 w-16 text-zinc-400 dark:text-zinc-600" />
            </div>
          )}

          {/* Price Badge */}
          {listing.price && (
            <div className="absolute left-4 bottom-4 z-10">
              <Badge
                className="text-base font-medium px-4 py-2 rounded-full 
                  bg-white/90 dark:bg-black/80 text-primary dark:text-primary-foreground
                  backdrop-blur-md shadow-lg border-0
                  transition-transform duration-300 group-hover:scale-105"
              >
                {listing.price}
              </Badge>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "h-9 w-9 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-md border-0",
                "transition-all duration-300 hover:scale-110",
                isFavorite && "bg-primary/90 text-primary-foreground hover:bg-primary/80",
              )}
              onClick={handleFavoriteClick}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-md border-0 transition-all duration-300 hover:scale-110"
              onClick={handleShareClick}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-5">
          {/* Address */}
          <div>
            <h3 className="font-semibold text-xl tracking-tight leading-tight text-zinc-900 dark:text-zinc-100">
              {listing.addressStreet}
            </h3>
            <div className="flex items-center mt-2 text-zinc-500 dark:text-zinc-400">
              <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <p className="text-sm truncate">
                {listing.addressCity}, {listing.addressState} {listing.addressZipcode}
              </p>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-3">
            {listing.beds?.toString() && (
              <div className="flex items-center px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 rounded-lg">
                <Bed className="h-4 w-4 mr-2 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm font-medium">
                  {listing.beds.toString()} <span className="text-xs text-zinc-500 dark:text-zinc-400">beds</span>
                </span>
              </div>
            )}

            {listing.baths?.toString() && (
              <div className="flex items-center px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 rounded-lg">
                <Bath className="h-4 w-4 mr-2 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm font-medium">
                  {listing.baths.toString()} <span className="text-xs text-zinc-500 dark:text-zinc-400">baths</span>
                </span>
              </div>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Info className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View property details</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* View Details Link */}
          {listing.detailUrl && (
            <div className="pt-2">
              <Link
                href={listing.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-all"
              >
                <span className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary after:origin-left after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out">
                  View property details
                </span>
                <ExternalLink className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Selection Indicator */}
        {isSelected && <div className="absolute inset-0 ring-2 ring-primary rounded-2xl pointer-events-none" />}
      </Card>
    </TooltipProvider>
  )
}

