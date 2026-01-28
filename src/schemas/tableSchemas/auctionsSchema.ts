import React from "react";
import { Auction } from "@/types/main";
import { ColDef } from "ag-grid-community";
import { formatTimestamp } from "@/helpers/dates";
import { StatusBadgeRenderer, ThumbnailRenderer } from "@/components/common/TableCellRenders";



// Base Columns configuration
export const auctionColumns: (ColDef<Auction>)[] = [

    // --- Primary Descriptive Fields ---
    { field: "title", headerName: "Title", flex: 1.5, filter: true },
    { field: "images", headerName: "Image", cellRenderer: ThumbnailRenderer },
    // { field: "desc", headerName: "Description", flex: 1.5 },
    // { field: "slug", headerName: "Slug", flex: 1 },
    // --- Key Relational/Status Fields ---
    // { field: "category", headerName: 'Category', flex: 1 },
    // { field: "is_active", headerName: 'Active', flex: 0.5 },
    // --- Pricing Fields ---
    // { field: "start_price", headerName: 'Start Price', flex: 1, valueFormatter: params => { return '$' + params.value.toLocaleString(); } },
    // { field: "reserve_price", headerName: 'Reserve Price', flex: 1, valueFormatter: params => { return '$' + params.value.toLocaleString(); } },
    // { field: "min_increment", headerName: 'Min Increment', flex: 1, valueFormatter: params => { return '$' + params.value.toLocaleString(); } },
    // --- Time/Audit Fields ---
    { field: "ended_at", headerName: 'End Time', flex: 1.2, valueFormatter: date => formatTimestamp(date.value) },
    { field: "created_at", headerName: 'Created At', flex: 1.2, valueFormatter: date => formatTimestamp(date.value) },
    { field: "updated_at", headerName: 'Updated At', flex: 1.2, valueFormatter: date => formatTimestamp(date.value) },
    // { field: "entry_fee", headerName: "Entry Fee", flex: 1, valueFormatter: params => { return '$' + params.value.toLocaleString(); } },
    // { field: "start_date", headerName: "Start Date", flex: 1, valueFormatter: date => formatTimestamp(date.value) },
    { field: "end_date", headerName: "End Date", flex: 1, valueFormatter: date => formatTimestamp(date.value) },
    { field: "status", headerName: "Status", flex: 1, cellRenderer: StatusBadgeRenderer, cellStyle: { display: "flex", alignItems: "center" }, },
];
