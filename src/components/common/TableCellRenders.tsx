import { CustomCellRendererProps } from "ag-grid-react";
import AuctionStatusBadge from "./AuctionStatusBadge";
import { Gallery, Item } from "react-photoswipe-gallery";
import { AuctionImage as AuctionImageType } from "@/types/main";
import "photoswipe/dist/photoswipe.css";


export const StatusBadgeRenderer = (props: CustomCellRendererProps) => {
  const stat = props.value;
  return <AuctionStatusBadge stat={stat} />
};

export const ThumbnailRenderer = (props: CustomCellRendererProps) => {
  const images: AuctionImageType[] = props.data.images;
  if (!images || images.length === 0) {
    return <span>No image</span>;
  }
  const first = images[0];

  return (
    <Gallery>
      <Item
        original={first.image}
        thumbnail={first.image_small_thumb}
        width="1024"
        height="768"
      >
        {({ ref, open }) => (
          <img
            ref={ref as any}
            onClick={open}
            src={first.image_small_thumb}
            alt="Auction image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
        )}
      </Item>
    </Gallery>

  );
};

