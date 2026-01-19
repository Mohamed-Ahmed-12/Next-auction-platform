export function objectToFormData(
    obj: any,
    useArrayIndex: boolean = false,
    formData: FormData = new FormData(),
    parentKey: string = ''
): FormData {

    // Define keys that represent file fields for robust skipping (customize this set)
    const FILE_FIELD_KEYS = new Set(['icon', 'image', 'file', 'attachment', 'thumbnail']);

    for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

        const propName = parentKey ? `${parentKey}.${key}` : key;
        const value = obj[key];

        // --- 1. Robust Skip Logic (omitted for brevity, assume it's correct) ---
        // ... (This section remains the same)
        if (value === null || value === undefined) {
            continue;
        }

        const isFileFieldKey = FILE_FIELD_KEYS.has(key);
        if (isFileFieldKey) {
            const isEmptyObject = typeof value === 'object' && Object.keys(value).length === 0;
            const isStringPath = typeof value === 'string';
            if (isEmptyObject || isStringPath) {
                continue;
            }
        }
        // --- END Skip Logic ---


        // Helper to detect RHF-style FileLists (which might not be a true browser FileList instance)
        const isRHFFileList =
            typeof value === 'object' &&
            value !== null &&
            'length' in value &&
            typeof (value as any).item === 'function';


        // --- 2. Handle ALL File-like objects FIRST (FileList, File, Blob, and RHF FileLists) ---
        if (value instanceof FileList || isRHFFileList) {
            const fileList: FileList = value as FileList;

            // Handle multi-file/array upload logic
            if (useArrayIndex || fileList.length > 1) {
                for (let i = 0; i < fileList.length; i++) {
                    const file = fileList[i];
                    if (file) {
                        // For multiple files, append with array notation (e.g., 'icon[0]', 'icon[1]')
                        const arrayKey = useArrayIndex ? `${propName}[${i}]` : propName;
                        formData.append(arrayKey, file, file.name);
                    }
                }
            }
            // Handle single file upload (THIS IS THE CRITICAL PATH FOR YOUR ISSUE)
            else if (fileList.length === 1) {
                const file = fileList[0];
                if (file) {
                    // Append using the exact propName (e.g., 'icon')
                    formData.append(propName, file, file.name);
                }
            }
        }
        // Handle standalone File objects and Blobs
        else if (value instanceof File || value instanceof Blob) {
            formData.append(propName, value, (value instanceof File ? value.name : 'blob.bin'));
        }

        // --- 3. Handle Arrays (Recursion) ---
        else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const currentItemKey = useArrayIndex ? `${propName}[${index}]` : propName;
                objectToFormData(item, useArrayIndex, formData, currentItemKey);
            });
        }

        // --- 4. Handle Nested Objects (Recursion) ---
        else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
            // Recurse into the object
            objectToFormData(value, useArrayIndex, formData, propName);
        }

        // --- 5. Handle Primitives ---
        else {
            if (value !== null && value !== undefined) {
                formData.append(propName, value.toString());
            }
        }
    }

    return formData;
}