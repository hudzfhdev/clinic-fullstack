import { Chip } from "@heroui/react";
import { CircleCheck, RotateCwFadingClockIcon } from "lucide-react";

const map = {
  active: { color: "success", icon: CircleCheck, label: "Active" },
  pending: {
    color: "warning",
    icon: RotateCwFadingClockIcon,
    label: "Pending",
  },
} as const;

export function ClinicStatusChips({
  status,
}: {
  status?: "active" | "pending" | null;
}) {
  const item = status ? map[status] : null;
  if (!item) {
    return <Chip>Unknown</Chip>;
  }
  return (
    <Chip color={item.color} variant="soft">
      <item.icon className="size-3.5" />
      <Chip.Label>{item.label}</Chip.Label>
    </Chip>
  );
}
