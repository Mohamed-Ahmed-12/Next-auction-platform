import { ColDef } from "ag-grid-community";
import { formatTimestamp } from "@/helpers/dates";
import { User } from "@/types/auth";


// Base Columns configuration
export const userColumns: (ColDef<User>)[] = [
    { field: "username", headerName: "Username", flex: 1, filter: true },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1, filter: true },
    { field: "date_joined", headerName: "Date Joined", flex: 1, valueFormatter: date => formatTimestamp(date.value) },
    { field: "last_login", headerName: "Last Login", flex: 1, valueFormatter: date => formatTimestamp(date.value) },
    { field: "is_staff", headerName: "Staff", flex: 1, },
    { field: "is_superuser", headerName: "Admin", flex: 1, },
    { field: "is_active", headerName: "Active", flex: 1, },
];
