import { useState, useCallback } from "react";
import { FilterChangedEvent } from "ag-grid-community";

export function useAgGridFilter() {
  const [filterModel, setFilterModel] = useState({});

  // reusable handler
  const handleFilterChange = useCallback((params: FilterChangedEvent) => {
    const newFilterModel = params.api.getFilterModel();
    setFilterModel(newFilterModel);
  }, []);

  return { filterModel, handleFilterChange };
}