"use client";

import React, { useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Category } from "@/types/main";
import { getCategoryColumns } from "@/schemas/tableSchemas/categoriesSchema";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { deleteCategory, updateCategory } from "@/services/CategoryService"; // Keep updateCategory for inline editing
import { Button, Spinner } from "flowbite-react";
import { actionsColumn } from "@/components/dashboard/actionsColumn";
import { toast } from "react-toastify";
import PageHeader from "@/components/dashboard/PageHeader";
import { Link } from "@/i18n/navigation";
import { useFetch } from "@/hooks/useFetcher";
import { useRouter } from "next/navigation";
import { CSVExport } from "@/components/dashboard/CSVExport";
import { CSVImport } from "@/components/dashboard/CSVImport";
import { useAgGridFilter } from "@/hooks/useAgGridFilter";
import { useLocale, useTranslations } from "next-intl";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function CategoriesPage() {
    const locale = useLocale()
    const t = useTranslations('dashboard')
    const tCategory = useTranslations('categories')
    const { data: categories, error, loading, refetch } = useFetch<Category[]>(`category/`);
    const rowData = categories || []; // Use empty array if data is undefined

    // filtering
    const { filterModel, handleFilterChange } = useAgGridFilter();

    // navigation
    const router = useRouter();
    // --- AG-GRID CONFIGURATION MEMOS ---

    const defaultColDef = useMemo(() => ({
        editable: true, // Enable editing on all cells
    }), []);

    const rowSelection = useMemo<RowSelectionOptions>(() => {
        return {
            mode: 'multiRow',
        };
    }, []);

    // --- ACTION HANDLERS ---

    const handleEdit = async (data: Category) => {
        router.push(`/dashboard/categories/edit/${data.id}`)
    };

    const handleDelete = async (data: Category) => {
        const isConfirmed = window.confirm(`Are you sure you want to permanently delete Category ID: ${data.id} ?`);

        if (isConfirmed) {
            try {
                await deleteCategory(data.id);
                toast.success(`Category "${data.id}" deleted successfully.`);
                await refetch();
            } catch (error) {
                toast.error("Failed to delete category.");
                console.error("Deletion error:", error);
            }
        }
    };

    // --- COLUMNS WITH ACTIONS ---
    const categoryColumns = useMemo(() => getCategoryColumns(tCategory), [tCategory]);
    const categoryColumnsWithActions = [
        ...categoryColumns,
        ...actionsColumn<Category>({
            onEdit: handleEdit,
            onDelete: handleDelete,
        }),
    ];

    // --- INLINE EDITING LOGIC ---

    const handleCellValueChanged = async (event: any) => {
        const originalValue = event.oldValue;
        const fieldName = event.colDef.field as keyof Category;

        try {
            // Optimistically update the grid row (already done by AG Grid)
            await updateCategory(event.data);
            toast.success("Updated Successfully");
            await refetch();
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update");

            // 1. Directly revert the data in the grid's model for the specific cell
            event.node.setDataValue(fieldName, originalValue);

            // 2. Tell the grid to refresh the cells visually
            event.api.refreshCells({ rowNodes: [event.node], force: true });
        }
    };

    if (loading && rowData.length === 0) {
        return <div className="text-center pt-8"><Spinner size="xl" /> Loading Categories...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading categories: {error}</div>;
    }

    return (
        <>
            <PageHeader title={t('categories')}>
                <div className="flex gap-2">
                    <CSVExport disabled={!(!!rowData.length)} columns={categoryColumns} modelLabel={'main.Category'} filters={filterModel} />
                    <CSVImport columnsTable={categoryColumns} modelLabel="main.Category" refetch={refetch} />
                    <Link href="/dashboard/categories/create">
                        <Button size="sm" className="cursor-pointer">
                            {t("createNew")}
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            <div className="ag-theme-quartz" style={{ height: "100%", width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={categoryColumnsWithActions}
                    loading={loading} // AG Grid will show its internal loading overlay if this is true
                    pagination={true}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                    onCellValueChanged={handleCellValueChanged}
                    onFilterChanged={handleFilterChange}
                    enableRtl={locale=="ar"}
                />
            </div>
        </>
    );
}