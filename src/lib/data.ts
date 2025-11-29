export const AUCTION_STATUS = ["live", "ended", "upcoming"] as const;
export type AuctionStatus = typeof AUCTION_STATUS[number];