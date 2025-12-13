import React from "react";
import { ColDef } from "ag-grid-community";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { CustomCellRendererProps } from "ag-grid-react";
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

export const StatusBadgeRenderer = (props: CustomCellRendererProps) => {
  const stat = props.value;
  if (stat === 'live') {
    return (
      <span className="h-fit relative flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-600 text-xs font-medium rounded-full dark:bg-green-400/20 dark:text-green-300">
        <span className="absolute inline-flex h-2 w-2 left-1 top-1/2 -translate-y-1/2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="pl-3">Live</span>
      </span>
    )
  } else if (stat === 'ended') {
    return (
      <span className="h-fit flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-600 text-xs font-medium rounded-full dark:bg-red-400/20 dark:text-red-300">
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        <span className="pl-1">Ended</span>
      </span>
    )
  } else if (stat === 'upcoming') {
    return (
      <span className="h-fit flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-600 text-xs font-medium rounded-full dark:bg-blue-400/20 dark:text-blue-300">
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        <span className="pl-1">Upcoming</span>
      </span>
    )
  }

  // Default return for an unhandled status
  return <>{stat}</>
};
