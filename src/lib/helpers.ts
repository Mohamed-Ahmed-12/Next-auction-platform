export function arrayToCommaString(arr: string[]) {
    // To work with django filters when one field can have more than value
    if (!Array.isArray(arr)) {
        throw new Error("Input must be an array");
    }
    return arr.join(","); // joins elements with commas
}