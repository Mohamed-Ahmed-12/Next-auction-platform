import { ColDef } from "ag-grid-community";

export function arrayToCommaString(arr: string[]) {
    // To work with django filters when one field can have more than value
    if (!Array.isArray(arr)) {
        throw new Error("Input must be an array");
    }
    return arr.join(","); // joins elements with commas
}

export function prepareFilterFileds() {
    const fields = [{ field: "title", headerName: "Title", flex: 1, filter: true },
    { field: "slug", headerName: "Slug", flex: 1 },
    { field: "icon", headerName: "Icon", flex: 1 },
    { field: "desc", headerName: "Description", flex: 1 },]
    for (let f = 0; f < fields.length; f++) {
        if (fields[f].filter) {
            console.log(fields[f].field)
        }
    }

}