"use client"
import { actionsColumn } from "@/components/dashboard/actionsColumn";
import { CSVExport } from "@/components/dashboard/CSVExport";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/useFetcher";
import { itemColumns } from "@/schemas/tableSchemas/itemsSchema";
import { Item } from "@/types/main";
import { AgGridReact } from "ag-grid-react";
import { Button } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ItemsPage() {
    const { data: items, error, loading, refetch } = useFetch<Item[]>(`items/`);
    const rowData = items || []; // Use empty array if data is undefined
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
    const handleEdit = (data:Item)=>{
        router.push(`/dashboard/items/edit/${data.slug}`)
    }
    const handleViewDetails = (data:Item)=>{
        router.push(`/dashboard/items/details/${data.slug}`)
    }

    // --- COLUMNS WITH ACTIONS ---

    const itemColumnsWithActions = [
        ...itemColumns,
        ...actionsColumn<Item>({
            onView:handleViewDetails,
            onEdit: handleEdit,
        }),
    ];

    return (
        <>
            <PageHeader title='Items'>
                <div className="flex gap-2">
                    <CSVExport columns={itemColumns} modelLabel={'main.Item'} />
                    <Link href="/dashboard/items/create">
                        <Button size="sm" className="cursor-pointer">
                            Create New Item
                        </Button>
                    </Link>
                </div>
            </PageHeader>
            <div className="ag-theme-quartz" style={{ height: "100%", width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={itemColumnsWithActions}
                    loading={loading} // AG Grid will show its internal loading overlay if this is true
                    pagination={true}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                />
            </div>
        </>
    )
}