import { CustomCellRendererProps } from "ag-grid-react";
import AuctionStatusBadge from "./AuctionStatusBadge";

export const StatusBadgeRenderer = (props: CustomCellRendererProps) => {
  const stat = props.value;
  return <AuctionStatusBadge stat={stat} />
};
