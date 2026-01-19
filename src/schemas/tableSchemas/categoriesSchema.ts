import { Category } from "@/types/main";
import { ColDef } from "ag-grid-community";

export const getCategoryColumns = (t: (key: string) => string, isMobile: boolean): ColDef<Category>[] => {
  console.log("isMobile:", isMobile);
  // Array of fields we want to hide when the screen is small
  const mobileHiddenFields = ["slug", "icon", "desc"];

  const columns: ColDef<Category>[] = [
    {
      field: "title",
      headerName: t("title"),
      flex: 1,
      filter: true,
      minWidth: 100 // Ensure the most important col has room
    },
    {
      field: "slug",
      headerName: t("slug"),
      flex: 1,
      minWidth: 100 // Ensure the most important col has room

    },
    {
      field: "icon",
      headerName: t("icon"),
      flex: 0.5, // Icons usually don't need much space
      minWidth: 100
    },
    {
      field: "desc",
      headerName: t("description"),
      flex: 2,
      minWidth: 150 // Ensure the most important col has room

    },
  ];

  // Map through columns to inject the 'hide' logic automatically
  return columns.map(col => ({
    ...col,
    hide: isMobile && mobileHiddenFields.includes(col.field as string)
  }));
}