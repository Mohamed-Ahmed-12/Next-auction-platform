import React from "react";
import { ColDef } from "ag-grid-community";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { BsEye } from "react-icons/bs";


/**
 * ActionsCell component for AG Grid
 */
type ActionsCellProps<T> = {
  row: T;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

function ActionsCell<T>({ row, onView, onEdit, onDelete }: ActionsCellProps<T>) {
  return (
    <div className="flex gap-2 items-center h-full">
      {
        onView != undefined &&
        <button
          className="text-gray-600 bg-gray-50 font-semibold cursor-pointer text-xl"
          onClick={() => onView(row)}
        >
          <BsEye />
        </button>
      }
      {onEdit != undefined &&
        <button
          className="text-blue-600 bg-blue-50 font-semibold cursor-pointer text-xl"
          onClick={() => onEdit(row)}
        >
          <BiEdit />
        </button>
      }
      {
        onDelete != undefined &&
        <button
          className="text-red-600 bg-red-50 font-semibold cursor-pointer text-xl"
          onClick={() => onDelete(row)}
        >
          <MdDeleteOutline />
        </button>
      }

    </div>
  );
}

/**
 * Generates a reusable Actions column for AG Grid
 */
export const actionsColumn = <T,>({
  onView,
  onEdit,
  onDelete,
}: {
  onView?:(row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}): ColDef<T>[] => [
    {
      headerName: "Actions",
      flex: 1,
      maxWidth: 150,
      cellRenderer: (params: { data: T; }) => (
        <ActionsCell row={params.data as T} onEdit={onEdit} onDelete={onDelete} onView={onView} />
      ),
    },
  ];

