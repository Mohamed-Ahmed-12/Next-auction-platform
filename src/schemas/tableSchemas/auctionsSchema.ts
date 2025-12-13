import { Auction } from "@/types/main";
import { ColDef } from "ag-grid-community";
import { StatusBadgeRenderer } from "../../components/dashboard/actionsColumn";
import { formatTimestamp } from "@/helpers/dates";


// Base Columns configuration
export const auctionColumns: (ColDef<Auction>)[] = [
    { field: "title", headerName: "Title", flex: 1, filter: true },
    { field: "slug", headerName: "Slug", flex: 1 },
    { field: "desc", headerName: "Description", flex: 1 },
    { field: "entry_fee", headerName: "Entry Fee", flex: 1, valueFormatter: params => { return '$' + params.value.toLocaleString(); } },
    { field: "item_count", headerName: "Items", flex: 1 },
    { field: "start_date", headerName: "Start Date", flex: 1, valueFormatter: date => formatTimestamp(date.value) },
    { field: "end_date", headerName: "End Date", flex: 1, valueFormatter: date => formatTimestamp(date.value) },
    { field: "status", headerName: "Status", flex: 1, cellRenderer: StatusBadgeRenderer, cellStyle: { display: "flex", alignItems: "center" }, },
];
