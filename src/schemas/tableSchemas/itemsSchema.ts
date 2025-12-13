import { formatTimestamp } from "@/helpers/dates";
import { Item } from "@/types/main";
import { ColDef } from "ag-grid-community";

// Base Columns configuration
export const itemColumns: (ColDef<Item>)[] = [
    // --- Primary Descriptive Fields ---
    { field: "title", headerName: "Title", flex: 1.5, filter: true },
    { field: "desc", headerName: "Description", flex: 1.5 },
    { field: "slug", headerName: "Slug", flex: 1 },
    // --- Key Relational/Status Fields ---
    // { field: "category", headerName: 'Category', flex: 1 },
    { field: "auction", headerName: 'Auction', flex: 1 },
    { field: "is_active", headerName: 'Active', flex: 0.5 },
    // --- Pricing Fields ---
    { field: "start_price", headerName: 'Start Price', flex: 1, valueFormatter: params => { return '$' + params.value.toLocaleString(); } },
    { field: "reserve_price", headerName: 'Reserve Price', flex: 1, valueFormatter: params => { return '$' + params.value.toLocaleString(); } },
    { field: "min_increment", headerName: 'Min Increment', flex: 1 , valueFormatter: params => { return '$' + params.value.toLocaleString(); }},
    // --- Time/Audit Fields ---
    { field: "end_at", headerName: 'End Time', flex: 1.2, valueFormatter: date => formatTimestamp(date.value) },
    { field: "created_at", headerName: 'Created At', flex: 1.2, valueFormatter: date => formatTimestamp(date.value) },
    { field: "updated_at", headerName: 'Updated At', flex: 1.2, valueFormatter: date => formatTimestamp(date.value) },
];