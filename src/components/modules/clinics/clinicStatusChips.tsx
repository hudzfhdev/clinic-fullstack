import { Chip } from "@heroui/react";
import type { ChipProps } from "@heroui/react";
import { CircleCheckIcon, RotateCwFadingClockIcon } from "lucide-react";

const map = {
  active: { color: "success", icon: CircleCheckIcon, label: "Active" },
  pending: {
    color: "warning",
    icon: RotateCwFadingClockIcon,
    label: "Pending",
  },
} as const;

export function ClinicStatusChips({
  status,
  ...props
}: Omit<ChipProps, "children"> & {
  status?: "active" | "pending" | null;
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
