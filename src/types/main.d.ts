export type Category = {
    id: number;
    name: string;
    icon: string;
    desc: string;
    slug: string;
}

export type Auction = {
    id: number;
    title: string;
    slug: string;
    desc: string;
    entry_fee: number;
    start_date: string;
    end_date: string;
}
