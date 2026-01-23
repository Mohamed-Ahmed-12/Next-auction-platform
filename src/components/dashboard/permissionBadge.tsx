import { Permission } from "@/types/roles";
import { Badge } from "flowbite-react";

export const PermissionCellRender = (params: any) => {
  return (
    <div className="flex flex-wrap gap-2">
      {params.value?.map((per: Permission) => (
        <Badge
          key={per.codename}
          color="indigo"
          className="text-xs"
        >
          {per.codename}
        </Badge>
      ))}
    </div>
  );
};