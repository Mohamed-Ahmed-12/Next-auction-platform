import React, { JSX } from "react";
import ContentLoader, { IContentLoaderProps } from "react-content-loader";

const AuctionListSkeleton = (props: IContentLoaderProps) => {
  const cardWidth = 320;
  const cardHeight = 400;
  const gapX = 30; // horizontal gap
  const gapY = 40; // vertical gap
  const cols = 3;
  const rows = 3;

  const startX = 0;
  const startY = 20;

  const cards: JSX.Element[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * (cardWidth + gapX);
      const y = startY + row * (cardHeight + gapY + 80); // 80 for text lines

      cards.push(
        <React.Fragment key={`${row}-${col}`}>
          {/* Image rectangle */}
          <rect x={x} y={y} rx="8" ry="8" width={cardWidth} height={cardHeight} />
          {/* Title line */}
          <rect x={x} y={y + cardHeight + 30} rx="0" ry="0" width={cardWidth} height="18" />
          {/* Subtitle line */}
          <rect x={x} y={y + cardHeight + 55} rx="0" ry="0" width={120} height="20" />
        </React.Fragment>
      );
    }
  }

  return (
    <ContentLoader
      viewBox="0 0 1200 900"
      height={900}
      width={1200}
      {...props}
    >
      {cards}
    </ContentLoader>
  );
};

export default AuctionListSkeleton;
