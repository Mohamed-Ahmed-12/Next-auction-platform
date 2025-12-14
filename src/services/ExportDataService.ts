import { buildFilterParams } from "@/helpers/filters";
import { axiosInstance } from "@/lib/network";

/**
 * Initiates an export request to the API and triggers an automatic file download
 * upon a successful binary data response.
 * 
 * @param {object} params - The parameters for the export function.
 * @param {string} params.modelLabel - The Django model name to export data from (e.g., 'User', 'Product').
 * @param {string[]} params.columns - An array of column field names (Django model field names) to include in the export.
 * @param {string} [params.format='xlsx'] - The desired file format for the export ('csv' or 'xlsx'). Defaults to 'xlsx'.
 * @returns {Promise<void>} A promise that resolves when the download is initiated or rejects on API/download error.
 */
export async function exportData({ modelLabel, columns, filters, format = 'xlsx' }: { modelLabel: string, columns: string[], filters?: any, format?: string }): Promise<void> {
    // 1. Prepare columns parameter string
    const columnString = columns.length > 0 ? columns.join(',') : '';

      // Build filter params if they exist
  const filterParams = buildFilterParams(filters);
    // 2. Make the request, specifically asking for an 'arraybuffer' or 'blob' response type
    const response = await axiosInstance.get('export-data', {
        params: {
            'dj_model': modelLabel,
            'columns': columnString,
            'file_format': format,
            ...filterParams
        },
        // Crucial for downloading files! Tells Axios to treat the response as binary data.
        responseType: 'blob'
    });

    // 3. Extract the suggested filename from headers (if provided by the backend)
    const contentDisposition = response.headers['content-disposition'];
    let filename = `export.${format}`; // Default filename adjusted to use format

    if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
            filename = match[1];
        }
    }

    // 4. Create a Blob from the response data
    // response.data is the actual file content (Blob)
    const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'text/csv'
    });

    // 5. Create a temporary URL and trigger the download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // Set the filename
    document.body.appendChild(link);
    link.click(); // Programmatically click the link to start download
    document.body.removeChild(link); // Clean up
    window.URL.revokeObjectURL(url); // Release the temporary URL
    console.log('File download initiated successfully.');

}