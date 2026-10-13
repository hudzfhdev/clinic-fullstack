import {
  CalendarClockIcon,
  DoorClosedIcon,
  HospitalIcon,
  IvBagIcon,
  SquareActivityIcon,
  StethoscopeIcon,
} from "lucide-react";
import type { ComponentProps } from "react";

export const mapEntityIcon = {
  clinics: HospitalIcon,
  patients: IvBagIcon,
  practitioners: StethoscopeIcon,
  rooms: DoorClosedIcon,
  services: SquareActivityIcon,
  appointments: CalendarClockIcon,
} as const;

export function EntityIcon({
  entity,
  ...props
}: ComponentProps<"svg"> & {
  entity: keyof typeof mapEntityIcon;
}) {
  const Icon = mapEntityIcon[entity];
  return <Icon {...props} aria-hidden />;
}
