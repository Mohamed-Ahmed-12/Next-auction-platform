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
    items: any;
    id: number;
    item_count: number;
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
    item: number;
    created_by: number;
    amount: number;
    created_at: string;

}
export type Item = {
    id: number;
    auction: number;
    title: string;
    desc: string;
    category: Category;
    start_price: number;
    reserve_price: number;
    min_increment: number;
    is_active: boolean;
    bids: Bids[];
    end_at?: string;
    slug: string;
}
export { AuctionStatus };

