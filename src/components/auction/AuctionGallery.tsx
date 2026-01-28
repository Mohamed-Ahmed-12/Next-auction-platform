"use client";

import Image from "next/image";
import { MouseEvent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Gallery, Item } from "react-photoswipe-gallery";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "photoswipe/dist/photoswipe.css";
import { AuctionImage as AuctionImageType } from "@/types/main";


// Thumbnail sizes dictionary (frontend mirror of backend settings)
const THUMBNAIL_SIZES: Record<"small" | "medium" | "large", [number, number]> = {
    small: [150, 150],
    medium: [300, 300],
    large: [600, 600],
};

// Utility to build srcSet string from backend thumbs
export function buildSrcSet(img: {
    image_small_thumb: string;
    image_medium_thumb: string;
    image_large_thumb: string;
}) {
    return `
    ${img.image_small_thumb} ${THUMBNAIL_SIZES.small[0]}w,
    ${img.image_medium_thumb} ${THUMBNAIL_SIZES.medium[0]}w,
    ${img.image_large_thumb} ${THUMBNAIL_SIZES.large[0]}w
  `;
}

// Utility to build sizes string
export function buildSizes() {
    return `
    (max-width: ${THUMBNAIL_SIZES.small[0]}px) ${THUMBNAIL_SIZES.small[0]}px,
    (max-width: ${THUMBNAIL_SIZES.medium[0]}px) ${THUMBNAIL_SIZES.medium[0]}px,
    ${THUMBNAIL_SIZES.large[0]}px
  `;
}

type Props = {
    images: AuctionImageType[];
};

export default function AuctionGallery({ images }: Props) {
    return (
        <Gallery>
            {/* Main gallery */}
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                navigation
                autoplay
                pagination={{ clickable: true }}
                className="w-full h-[300px] md:h-[400px]"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <Item
                            original={img.image}
                            thumbnail={img.image_medium_thumb}
                            width="1024"
                            height="768"
                        >
                            {({ ref, open }) => (
                                <div className="relative w-full h-full">
                                    <AuctionImage
                                        img={img}
                                        alt={`Auction image ${index}`}
                                        onClick={open}
                                        refProp={ref}
                                    />
                                </div>
                            )}
                        </Item>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnail strip */}
            <Swiper
                modules={[Thumbs]}
                spaceBetween={8}
                slidesPerView={4}
                watchSlidesProgress
                className="mt-4 w-full h-24"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full rounded-md overflow-hidden border border-gray-200 cursor-pointer">
                            <AuctionImage img={img} alt={`Thumbnail ${index}`} isThumbnail />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Gallery>
    );
}

type AuctionImageProps = {
    img: AuctionImageType;
    alt: string;
    isThumbnail?: boolean;
    onClick?: (e: MouseEvent<Element>) => void;
    refProp?: any;
};

export function AuctionImage({
    img,
    alt,
    isThumbnail = false,
    onClick,
    refProp,
}: AuctionImageProps) {
    if (isThumbnail) {
        // Use <img> for backend thumbnails
        return (
            <img
                srcSet={buildSrcSet(img)}
                sizes={buildSizes()}
                alt={alt}
                className="object-cover"
            />
        );
    }

    // Use Next <Image> for main gallery
    return (
        <Image
            ref={refProp}
            onClick={onClick}
            src={img.image}
            alt={alt}
            fill
            className="object-cover cursor-pointer rounded-md"
        />
    );
}
