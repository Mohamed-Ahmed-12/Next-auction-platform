/**
 * Resolves a displayable string from a label that may be localized or static.
 * * @param label - The label to resolve. Can be a simple `string` or a 
 * key-value object where keys are language codes (e.g., { en: "Name", ar: "الاسم" }).
 * @param lang - The preferred language code to look up in the label object.
 * * @returns The resolved string. If `label` is an object, it returns the value matching `lang`.
 * If the key is missing, it falls back to 'en'. If `label` is a string, it returns it directly.
 * * @example
 * // Returns "Username"
 * displayLabel("Username", "en"); 
 * * @example
 * // Returns "اسم المستخدم"
 * displayLabel({ en: "Username", ar: "اسم المستخدم" }, "ar");
 */
export function displayLabel(label: { [key: string]: string } | string, lang: string): string {
  if (typeof label === 'string') {
    // Type Narrowing: TypeScript treats label as a string here
    return label;
  } 
  
  // Type Narrowing: TypeScript treats label as an Index Signature object here
  // Fallback chain: Preferred Lang -> English -> Empty String
  return label[lang] || label['en'] || "";
}