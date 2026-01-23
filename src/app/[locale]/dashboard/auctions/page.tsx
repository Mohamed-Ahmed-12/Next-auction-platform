"use client";

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Auction } from "@/types/main";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { actionsColumn } from "@/components/dashboard/actionsColumn";
import { auctionColumns } from "@/schemas/tableSchemas/auctionsSchema";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import CreateNewBtn from "@/components/dashboard/CreateNewBtn";
import { useFetch } from "@/hooks/useFetcher";
import { useRouter } from "next/navigation";
import { UniversalExport } from "@/components/dashboard/UniversalExport";
import { useLocale, useTranslations } from "next-intl";


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
    const isExportDisabled = loading || !data || data.length === 0;

    if (error) return <div>Error loading auctions.</div>;

    return (
        <>
            <PageHeader
                title={t('auctions')}
                breadcrumbs={[
                    { label: 'Auctions', href: '/dashboard/auctions' },
                    { label: 'Live Listings' }
                ]}
                description="Manage your active listings, monitor real-time bidding activity, and export performance reports."
            >
                <div className="flex items-center gap-3 bg-white p-1 rounded-xl">
                    <UniversalExport
                        disabled={isExportDisabled}
                        columns={auctionColumns}
                        modelLabel={'main.Auction'}
                    />
                    <Link href="/dashboard/auctions/create">
                        <CreateNewBtn />
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
                    enableRtl={locale == "ar"}
                />
            </div>
        </>
    );
}
