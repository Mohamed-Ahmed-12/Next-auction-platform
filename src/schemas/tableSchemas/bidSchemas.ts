import { Bids } from "@/types/main";
import { ColDef } from "ag-grid-community";

// Base Columns configuration
export const bidColumns: (ColDef<Bids>)[] = [
  { field: "created_by", headerName: "Bidder", flex: 1 , filter:true },
  { field: "amount", headerName: "Bid Amount", flex: 1 },
  { field: "created_at", headerName: "Time", flex: 1 },
];
