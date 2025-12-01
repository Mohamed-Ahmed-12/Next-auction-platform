"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Category } from "@/types/main";
import { categoryColumns } from "@/tableSchemas/categoriesSchema";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { fetchCategories, updateCategory } from "@/services/CategoryService";
import { Spinner } from "flowbite-react";
import { actionsColumn } from "@/tableSchemas/actionsColumn";
import { toast } from "react-toastify";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function CategoriesPage() {
    const defaultColDef = useMemo(() => ({
        editable: true, // Enable editing on all cells
    }), [])
    const rowSelection = useMemo<RowSelectionOptions>(() => {
        return {
            mode: 'multiRow',
        };
    }, []);
    const [data, setData] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)

    const handleEdit = (data: Category) => {
        console.log(data)
    }
    const handleDelete = (data: Category) => {
        console.log(data)
    }


    // Columns with actions
    const categoryColumnsWithActions = [
        ...categoryColumns,
        ...actionsColumn<Category>({
            onEdit: handleEdit,
            onDelete: handleDelete,
        }),
    ];

    useEffect(() => {
        setLoading(true)
        fetchCategories()
            .then((data) => {
                setData(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])
    return (
        <>
            <h1 className="text-indigo-600 font-bold text-2xl mb-4">
                Categories
            </h1>

            <div className="h-full">
                <AgGridReact
                    rowData={data}
                    columnDefs={categoryColumnsWithActions}
                    loading={loading}
                    loadingOverlayComponent={Spinner}
                    pagination={true}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                    onCellValueChanged={event => {
                        updateCategory(event.data)
                            .then(() => {
                                toast.success("Updated Successfully")
                            })
                            .catch((err) => {
                                toast.error(err.message ?? "Failed to update")
                            })
                    }}
                />
            </div>
        </>
    );
}
