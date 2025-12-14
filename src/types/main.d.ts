import { AuctionStatus } from "@/lib/data";

export type Category = {
    id: number;
    title: string;
    icon: string;
    desc: string;
    slug: string;
}

export type Auction = {
    [x: string]: any;
    id: number;
    title: string;
    slug: string;
    desc: string;
    entry_fee: number;
    start_date: string;
    end_date: string;
    status: AuctionStatus;
    category: Category;

}

export type Bids = {
    id: number;
    auction: number;
    created_by: number;
    amount: number;
    created_at: string;

}

export { AuctionStatus };

