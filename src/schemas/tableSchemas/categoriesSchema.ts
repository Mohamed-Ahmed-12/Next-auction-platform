import { Category } from "@/types/main";
import { ColDef } from "ag-grid-community";

// Factory function that accepts the translation function 
export const getCategoryColumns = (t: (key: string) => string): ColDef<Category>[] =>
  [{ field: "title", headerName: t("title"), flex: 1, filter: true },
  { field: "slug", headerName: t("slug"), flex: 1 },
  { field: "icon", headerName: t("icon"), flex: 1 },
  { field: "desc", headerName: t("description"), flex: 1 },
  ];