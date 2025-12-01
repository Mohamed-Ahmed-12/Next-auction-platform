"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Auction } from "@/types/main";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { Spinner } from "flowbite-react";
import { actionsColumn } from "@/tableSchemas/actionsColumn";
import { fetchAuctions } from "@/services/AuctionService";
import { auctionColumns } from "@/tableSchemas/auctionsSchema";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AuctionsPage() {
    const defaultColDef = useMemo(() => ({
        editable: true, // Enable editing on all cells
    }), [])
    const rowSelection = useMemo<RowSelectionOptions>(() => {
        return {
            mode: 'multiRow',
        };
    }, []);
    const [data, setData] = useState<Auction[]>([])
    const [loading, setLoading] = useState(false)

    const handleEdit = (data: Auction) => {
        console.log(data)
    }
    const handleDelete = (data: Auction) => {
        console.log(data)
    }


    // Columns with actions
    const auctionColumnsWithActions = [
        ...auctionColumns,
        ...actionsColumn<Auction>({
            onEdit: handleEdit,
            onDelete: handleDelete,
        }),
    ];

    useEffect(() => {
        setLoading(true)
        fetchAuctions()
            .then((data) => {
                console.log(data)
                setData(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])
    return (
        <>
            <h1 className="text-indigo-600 font-bold text-2xl mb-4">
                Auctions
            </h1>

            <div className="h-full">
                <AgGridReact
                    rowData={data}
                    columnDefs={auctionColumnsWithActions}
                    loading={loading}
                    loadingOverlayComponent={Spinner}
                    pagination={true}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                // onCellValueChanged={event => {
                //     updateCategory(event.data)
                //         .then(() => {
                //             toast.success("Updated Successfully")
                //         })
                //         .catch((err) => {
                //             toast.error(err.message ?? "Failed to update")
                //         })
                // }}
                />
            </div>
        </>
    );
}
