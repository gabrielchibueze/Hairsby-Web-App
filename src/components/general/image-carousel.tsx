// "use client";

// import Image from "next/image";
// import useEmblaCarousel from "embla-carousel-react";
// import { useState } from "react";
// import { cn } from "@/lib/utils";

// interface ServiceImagesProps {
//   images: string[];
//   name: string;
//   price?: number;
//   discountPrice?: number;
//   className?: string;
//   flex?: boolean;
// }

// export function ImageCarousel({
//   images,
//   name,
//   price = 0,
//   discountPrice = 0,
//   className = "",
//   flex,
// }: ServiceImagesProps) {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const hasDiscount = discountPrice && Number(discountPrice) < Number(price);

//   const [emblaRef] = useEmblaCarousel({
//     align: "start",
//     containScroll: "trimSnaps",
//     dragFree: true,
//   });

//   return (
//     <div
//       className={cn(`${flex ? "sm:grid sm:grid-cols-2 gap-4" : ""}`, className)}
//     >
//       {/* Main Image */}
//       <div
//         className={`relative aspect-square rounded-lg bg-gray-100 overflow-hidden mb-4 ${flex ? "sm:max-w-[500px] sm:max-h-400px]" : ""}`}
//       >
//         <Image
//           src={images[selectedImage]}
//           alt={name}
//           fill
//           className="object-cover"
//           priority
//         />
//         {hasDiscount && (
//           <div className="absolute top-4 left-4 bg-hairsby-orange text-white text-sm font-bold px-3 py-1 rounded-full">
//             {Math.round(
//               ((Number(price) - Number(discountPrice)) / Number(price)) * 100
//             )}
//             % OFF
//           </div>
//         )}
//       </div>

//       {/* Thumbnail Carousel */}
//       {images.length > 1 && (
//         <div className="embla overflow-hidden" ref={emblaRef}>
//           <div className="embla__container flex">
//             {images.map((image, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedImage(index)}
//                 className={`embla__slide flex-shrink-0 aspect-square rounded-md overflow-hidden border-2 mx-1 ${
//                   selectedImage === index
//                     ? "border-hairsby-orange"
//                     : "border-transparent"
//                 }`}
//                 style={{ maxWidth: "100%" }}
//               >
//                 <Image
//                   src={image}
//                   alt={`${name} thumbnail ${index + 1}`}
//                   width={70}
//                   height={70}
//                   className="object-cover w-full h-full"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceImagesProps {
  images: string[];
  name: string;
  price?: number;
  discountPrice?: number;
  className?: string;
}

export function ImageCarousel({
  images,
  name,
  price = 0,
  discountPrice = 0,
  className = "",
}: ServiceImagesProps) {
  const options: EmblaOptionsType = {
    loop: true,
    dragFree: false,
    containScroll: "trimSnaps",
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const hasDiscount = discountPrice && Number(discountPrice) < Number(price);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Carousel */}
      <div className="embla overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="embla__container flex touch-pan-y h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className="embla__slide flex-[0_0_100%] min-w-0 relative aspect-square bg-gray-100"
            >
              <Image
                src={image}
                alt={`${name} - Image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {hasDiscount && index === 0 && (
                <div className="absolute top-4 left-4 bg-hairsby-orange text-white text-sm font-bold px-3 py-1 rounded-full">
                  {Math.round(
                    ((Number(price) - Number(discountPrice)) / Number(price)) *
                      100
                  )}
                  % OFF
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-opacity duration-200 ${
              isHovering && prevBtnEnabled ? "opacity-100" : "opacity-0"
            }`}
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-opacity duration-200 ${
              isHovering && nextBtnEnabled ? "opacity-100" : "opacity-0"
            }`}
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                index === selectedIndex
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
