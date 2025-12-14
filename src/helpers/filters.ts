
export function arrayToCommaString(arr: string[]) {
    // To work with django filters when one field can have more than value
    if (!Array.isArray(arr)) {
        throw new Error("Input must be an array");
    }
    return arr.join(","); // joins elements with commas
}

export function buildFilterParams(filters?: Record<string, any>): Record<string, string> {
  if (!filters || Object.keys(filters).length === 0) {
    return {}; // no filters
  }

  const params: Record<string, string> = {};

  Object.entries(filters).forEach(([field, filterObj]) => {
    if (!filterObj) return;

    // Example: AgGrid filterObj = { type: "contains", filter: "Books" }
    const { type, filter } = filterObj;

    if (filter == null || filter === "") return; // skip empty

    // Map AgGrid filter types to Django filter suffixes
    let suffix = "";
    switch (type) {
      case "contains":
        suffix = "__icontains";
        break;
      case "equals":
        suffix = "";
        break;
      case "startsWith":
        suffix = "__istartswith";
        break;
      case "endsWith":
        suffix = "__iendswith";
        break;
      case "greaterThan":
        suffix = "__gt";
        break;
      case "lessThan":
        suffix = "__lt";
        break;
      default:
        suffix = "";
    }

    params[`${field}${suffix}`] = filter;
  });

  return params;
}
