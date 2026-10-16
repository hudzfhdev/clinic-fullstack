import type { Practitioner } from "#/isomorphic/schema/practitioners.schema.ts";
import { Chip, DangerIcon, WarningIcon } from "@heroui/react";
import type { ChipProps } from "@heroui/react";
import { CircleCheckIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const map = {
  active: { color: "success", icon: CircleCheckIcon, label: "Active" },
  suspended: {
    color: "danger",
    icon: DangerIcon,
    label: "Suspended",
  },
  inactive: { color: "danger", label: "Inactive", icon: WarningIcon },
} as Record<
  Practitioner["status"],
  { color: ChipProps["color"]; icon: LucideIcon; label: string }
>;

export function PractitionerStatusChips({
  status,
  ...props
}: Omit<ChipProps, "children"> & {
  status?: Practitioner["status"];
}) {
  const item = status ? map[status] : null;
  if (!item) {
    return <Chip>Unknown</Chip>;
  }
  return (
    <Chip {...props} color={item.color} variant="soft">
      <item.icon className="size-3.5" />
      <Chip.Label>{item.label}</Chip.Label>
    </Chip>
  );
}
