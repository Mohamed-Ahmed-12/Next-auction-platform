"use client";

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { Button, Spinner } from "flowbite-react";
import { actionsColumn } from "@/components/dashboard/actionsColumn";
import PageHeader from "@/components/dashboard/PageHeader";
import { Link } from "@/i18n/navigation";
import { useFetch } from "@/hooks/useFetcher";
import { useRouter } from "next/navigation";
import { UniversalExport } from "@/components/dashboard/UniversalExport";
import { User } from "@/types/auth";
import { userColumns } from "@/schemas/tableSchemas/authSchemas";
import { CSVImport } from "@/components/dashboard/CSVImport";
import { useAgGridFilter } from "@/hooks/useAgGridFilter";
import { useLocale, useTranslations } from "next-intl";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function UsersPage() {
    const locale = useLocale()
    const t = useTranslations('dashboard')
    const { data: users, error, loading, refetch } = useFetch<User[]>(`auth/users/`);
    const rowData = users || []; // Use empty array if data is undefined

    // filtering
    const { filterModel, handleFilterChange } = useAgGridFilter();

    // navigation
    const router = useRouter();
    // --- AG-GRID CONFIGURATION MEMOS ---

    const defaultColDef = useMemo(() => ({
        editable: false, // Enable editing on all cells
    }), []);

    const rowSelection = useMemo<RowSelectionOptions>(() => {
        return {
            mode: 'multiRow',
        };
    }, []);

    // --- ACTION HANDLERS ---

    const handleEdit = async (data: User) => {
        router.push(`/dashboard/users/edit/${data.id}`)
    };

    // --- COLUMNS WITH ACTIONS ---

    const userColumnsWithActions = [
        ...userColumns,
        ...actionsColumn<User>({
            onEdit: handleEdit,
        }),
    ];

    // --- INLINE EDITING LOGIC ---

    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading users...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading users: {error}</div>;
    }

    return (
        <>
            <PageHeader title={t('users')}>
                <div className="flex gap-2">
                    <UniversalExport disabled={!(!!rowData.length)} columns={userColumns} modelLabel={'authen.CustomUser'} filters={filterModel} />
                    <CSVImport columnsTable={userColumns} modelLabel={'authen.CustomUser'} refetch={refetch} />
                    <Link href="/dashboard/users/create">
                        <Button size="sm" className="cursor-pointer">
                            {t("createNew")}
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            <div className="ag-theme-quartz" style={{ height: "100%", width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={userColumnsWithActions}
                    loading={loading} // AG Grid will show its internal loading overlay if this is true
                    pagination={true}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                    onFilterChanged={handleFilterChange}
                    enableRtl={locale=="ar"}

                />
            </div>
        </>
    );
}
