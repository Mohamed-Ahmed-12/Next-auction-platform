"use client";

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Category } from "@/types/main";
import { categoryColumns } from "@/schemas/tableSchemas/categoriesSchema";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { deleteCategory, updateCategory } from "@/services/CategoryService"; // Keep updateCategory for inline editing
import { Button, Spinner } from "flowbite-react";
import { actionsColumn } from "@/schemas/tableSchemas/actionsColumn";
import { toast } from "react-toastify";
import PageHeader from "@/components/dashboard/PageHeader";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetcher";
import { useRouter } from "next/navigation";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function CategoriesPage() {
    const { data: categories, error, loading, refetch } = useFetch<Category[]>(`category/`);
    const rowData = categories || []; // Use empty array if data is undefined

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
            <PageHeader title='Categories'>
                <Link href="/dashboard/categories/create">
                    <Button size="sm" className="cursor-pointer">
                        Create New Category
                    </Button>
                </Link>
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
                />
            </div>
        </>
    );
}