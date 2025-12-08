"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Auction } from "@/types/main";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { Button, Spinner } from "flowbite-react";
import { actionsColumn } from "@/schemas/tableSchemas/actionsColumn";
import { auctionColumns } from "@/schemas/tableSchemas/auctionsSchema";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/useFetcher";
import { useRouter } from "next/navigation";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AuctionsPage() {
    const { data, error, loading } = useFetch<Auction[]>(`auction/`);
    const router = useRouter();
    const defaultColDef = useMemo(() => ({
        editable: true, // Enable editing on all cells
    }), [])
    const rowSelection = useMemo<RowSelectionOptions>(() => {
        return {
            mode: 'multiRow',
        };
    }, []);


    const handleEdit = (data: Auction) => {
        router.push(`/dashboard/auctions/edit/${data.slug}`)
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

    return (
        <>
            <PageHeader title={'Auctions'}>
                <Link href="/dashboard/auctions/create">
                    <Button>
                        Create New Auction
                    </Button>
                </Link>
            </PageHeader>


            <div className="ag-theme-quartz" style={{ height: "100%", width: '100%' }}>
                <AgGridReact
                    rowData={data}
                    columnDefs={auctionColumnsWithActions}
                    loading={loading}
                    // loadingOverlayComponent={Spinner}
                    pagination={true}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                />
            </div>
        </>
    );
}
