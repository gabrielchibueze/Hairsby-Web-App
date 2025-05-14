"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ServiceImagesProps {
  images: string[];
  name: string;
  price?: number;
  discountPrice?: number;
  className?: string;
  flex?: boolean;
}

export function ImageCarousel({
  images,
  name,
  price = 0,
  discountPrice = 0,
  className = "",
  flex,
}: ServiceImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const hasDiscount = discountPrice && Number(discountPrice) < Number(price);

  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  return (
    <div
      className={cn(`${flex ? "sm:grid sm:grid-cols-2 gap-4" : ""}`, className)}
    >
      {/* Main Image */}
      <div
        className={`relative aspect-square rounded-lg bg-gray-100 overflow-hidden mb-4 ${flex ? "sm:max-w-[500px] sm:max-h-400px]" : ""}`}
      >
        <Image
          src={images[selectedImage]}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-hairsby-orange text-white text-sm font-bold px-3 py-1 rounded-full">
            {Math.round(
              ((Number(price) - Number(discountPrice)) / Number(price)) * 100
            )}
            % OFF
          </div>
        )}
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`embla__slide flex-shrink-0 aspect-square rounded-md overflow-hidden border-2 mx-1 ${
                  selectedImage === index
                    ? "border-hairsby-orange"
                    : "border-transparent"
                }`}
                style={{ maxWidth: "100%" }}
              >
                <Image
                  src={image}
                  alt={`${name} thumbnail ${index + 1}`}
                  width={70}
                  height={70}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
