import { ColDef } from "ag-grid-community";
import { Role } from "@/types/roles";
import { PermissionCellRender } from "@/components/dashboard/permissionBadge";


// Base Columns configuration
export const roleColumns: (ColDef<Role>)[] = [
    { field: "id", headerName: "ID",},
    { field: "name", headerName: "Role (Group)"},
    { field: "permissions", headerName: "Permissions", flex: 2, cellRenderer: PermissionCellRender},

];

