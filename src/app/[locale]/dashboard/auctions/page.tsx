"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Auction } from "@/types/main";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { Button, Spinner } from "flowbite-react";
import { actionsColumn } from "@/components/dashboard/actionsColumn";
import { auctionColumns } from "@/schemas/tableSchemas/auctionsSchema";
import {Link} from "@/i18n/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/useFetcher";
import { useRouter } from "next/navigation";
import { CSVExport } from "@/components/dashboard/CSVExport";
import { useLocale, useTranslations } from "next-intl";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AuctionsPage() {
    const locale = useLocale();
    const t = useTranslations('dashboard')
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


    const handleViewDetails = (data: Auction) => {
        router.push(`/dashboard/auctions/details/${data.slug}`)
    }


    // Columns with actions
    const auctionColumnsWithActions = [
        ...auctionColumns,
        ...actionsColumn<Auction>({
            onEdit: handleEdit,
            onView: handleViewDetails,

        }),
    ];

    return (
        <>
            <PageHeader title={t('auctions')}>
                <div className="flex gap-2">
                    <CSVExport columns={auctionColumns} modelLabel={'main.Auction'} />
                    <Link href="/dashboard/auctions/create">
                        <Button>
                            {t("createNew")}
                        </Button>
                    </Link>
                </div>
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
                    enableRtl={locale=="ar"}
                />
            </div>
        </>
    );
}
