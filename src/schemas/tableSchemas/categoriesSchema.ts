import { Category } from "@/types/main";
import { ColDef } from "ag-grid-community";

// Base Columns configuration
export const categoryColumns: (ColDef<Category>)[] = [
  { field: "title", headerName: "Title", flex: 1 , filter:true },
  { field: "slug", headerName: "Slug", flex: 1 },
  { field: "icon", headerName: "Icon", flex: 1 },
  { field: "desc", headerName: "Description", flex: 1 },
];
