"use client";

import CreateNewBtn from "@/components/dashboard/CreateNewBtn";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/useFetcher";
import { roleColumns } from "@/schemas/tableSchemas/roleScheme";
import { Role } from "@/types/roles";
import { AgGridReact } from "ag-grid-react";
import { useLocale, useTranslations } from "next-intl";

export default function RolesPermissions() {
    const t = useTranslations('dashboard')
    const locale = useLocale();
    const { data: roles, error, loading, refetch } = useFetch<Role[]>(`auth/roles-perm/`);
    return (
        <>
            <PageHeader title={"Roles"}>
                <div className="flex gap-2">
                    <CreateNewBtn />
                </div>
            </PageHeader>
            <div className="ag-theme-quartz" style={{ height: "100%", width: '100%' }}>
                <AgGridReact
                    rowData={roles}
                    columnDefs={roleColumns}
                    loading={loading}
                    pagination={true}
                    enableRtl={locale == "ar"}
                />
            </div>
        </>
    );
}
