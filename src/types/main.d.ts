
import { AuctionStatus } from "@/lib/data";

export type Category = {
    id: number;
    title: string;
    icon: string;
    desc: string;
    slug: string;
}
export type Bids = {
    id: number;
    auction: number;
    created_by: number;
    amount: number;
    created_at: string;

}
export type AuctionResult = {
    winner: number,
    winner_name: string,
    winning_bid: number,
    final_price: string,
    reserve_met: boolean,
    finalized_at: string

}
export type Auction = {
    // [x: string]: any;
    id: number;
    title: string;
    slug: string;
    desc: string;
    entry_fee: number;
    start_date: string;
    end_date: string;
    ended_at: string;
    status: AuctionStatus;
    category: Category;
    start_price: number;
    reserve_price: number;
    min_increment: number;
    is_active: boolean;
    bids: Bids[];
    created_by: number;
    created_at: string;
    updated_at: string;
    result?: AuctionResult;
}

export { AuctionStatus };
