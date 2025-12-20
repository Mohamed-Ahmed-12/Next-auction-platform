// utils/errorMapping.ts

import { ErrorData } from "@/types/error";
import { FieldValues, UseFormSetError, Path } from "react-hook-form";

/**
 * Maps API field errors (e.g., { email: ["Invalid"], password: ["Too short"] })
 * to React Hook Form's setError function.
 * * @template TFormValues The generic type representing your form's data structure.
 * @param fieldErrors The error object from the API response data (e.g., from Django REST Framework).
 * @param setError The setError function obtained from useForm hook.
 */
export const mapApiErrorsToFormFields = <TFormValues extends FieldValues>(
    fieldErrors: any,
    setError: UseFormSetError<TFormValues>
) => {
    // Ensure fieldErrors is a non-null object
    if (!fieldErrors || typeof fieldErrors !== 'object') {
        return;
    }

    // Iterate over the keys (field names) in the error response
    // We use Object.keys() which returns string[], hence the need for casting below.
    Object.keys(fieldErrors).forEach((fieldName) => {
        let errorMsg: string;
        const errorValue = fieldErrors[fieldName];

        // --- Error Message Extraction Logic ---
        if (Array.isArray(errorValue)) {
            // DRF often returns errors as arrays of strings
            errorMsg = errorValue.join(' ');
        } else if (typeof errorValue === 'string') {
            // Single string error
            errorMsg = errorValue;
        } else if (typeof errorValue === 'object' && errorValue !== null) {
            // This handles nested fields if you need to support them, or complex errors
            errorMsg = 'Invalid value.';
        } else {
            return; // Skip if error structure is unexpected
        }

        // --- Calling setError ---
        // We must cast fieldName to Path<TFormValues> to satisfy TypeScript
        setError(
            fieldName as Path<TFormValues>, 
            { 
                type: 'server', 
                message: errorMsg 
            }, 
            { 
                shouldFocus: true 
            }
        );
    });
};


/**
 * Asynchronously reads the content of an error Blob (e.g., in a file download failure), 
 * parses it as JSON, and returns the resulting object, or a default error object on failure.
 */
export async function readBlobError(errorBlob: Blob): Promise<ErrorData> {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onerror = () => {
            resolve({ detail: "Failed to read error details from blob." });
        };

        reader.onload = () => {
            try {
                const resultText = reader.result as string;
                if (resultText) {
                    const errorData: ErrorData = JSON.parse(resultText);
                    resolve(errorData);
                } else {
                    resolve({ detail: "Server returned an empty error response." });
                }
            } catch (e) {
                resolve({ detail: "Server returned a non-JSON or invalid error response." });
            }
        };

        reader.readAsText(errorBlob);
    });
}