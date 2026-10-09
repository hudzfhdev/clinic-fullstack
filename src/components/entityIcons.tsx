import { HospitalIcon, IvBagIcon, StethoscopeIcon } from "lucide-react";
import type { ComponentProps } from "react";

export const mapEntityIcon = {
  clinics: HospitalIcon,
  patients: IvBagIcon,
  practitioners: StethoscopeIcon,
} as const;

export function EntityIcon({
  entity,
  ...props
}: ComponentProps<"svg"> & {
  entity: "clinics" | "patients" | "practitioners";
}) {
  const Icon = mapEntityIcon[entity];
  return <Icon {...props} />;
}
