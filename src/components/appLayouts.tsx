import { MatchRoute, Link } from "@tanstack/react-router";
import { Drawer, Button, Link as HeroLink } from "@heroui/react";
import { LayoutDashboardIcon, MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ComponentType, PropsWithChildren, SVGProps } from "react";
import { cn } from "cn";
import { mapEntityIcon } from "./entityIcons";
import { AppComboBox, toComboBoxOptions } from "./common/appComboBox";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "#/orpc/client.ts";
import { createAtom, useAtom, useSelector } from "@tanstack/react-store";

export function AppPageLayout({
  children,
  className,
  isFullWidth = true,
}: PropsWithChildren & { isFullWidth?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "p-6 bg-background grow",
        { "w-full": isFullWidth },
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AppPrivateLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      {children}
    </div>
  );
}

function AppHeader({ children }: PropsWithChildren) {
  const selectedGlobalClinicId = useSelector(selectedGlobalClinicAtom);

  return (
    <header className="flex p-3 shadow-md sticky min-h-16 top-0 bg-surface z-10">
      <div className="flex gap-2 items-center">
        <AppSidebar />
        <SelectGlobalClinic />
        {selectedGlobalClinicId ?? "No global clinic selected"}
      </div>
      {children}
    </header>
  );
}

export const navItems: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  to: string;
}[] = [
  { icon: LayoutDashboardIcon, label: "Dashboard", to: "/dashboard" },
  { icon: mapEntityIcon["clinics"], label: "Clinics", to: "/clinics" },
  {
    icon: mapEntityIcon["appointments"],
    label: "Appointments",
    to: "/appointments",
  },
  {
    icon: mapEntityIcon["practitioners"],
    label: "Practitioners",
    to: "/practitioners",
  },
  { icon: mapEntityIcon["patients"], label: "Patients", to: "/patients" },
  { icon: mapEntityIcon["rooms"], label: "Rooms", to: "/rooms" },
  { icon: mapEntityIcon["services"], label: "Services", to: "/services" },
];

function AppSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer isOpen={open} onOpenChange={setOpen}>
      <Button
        size="sm"
        variant="ghost"
        isIconOnly
        aria-label="toggle menu drawer"
      >
        <MenuIcon />
      </Button>
      <Drawer.Backdrop variant="blur">
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading>Main</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <HeroLink
                    key={item.label}
                    onPress={() => setOpen(false)}
                    render={({ className, ...props }) => (
                      <MatchRoute to={item.to} fuzzy={false}>
                        {(match) => (
                          <span {...props}>
                            <Link
                              to={item.to}
                              className={cn(
                                className,
                                "flex items-center gap-3 no-underline w-full px-3 py-2.5",
                                "rounded-xl text-sm text-foreground transition-colors hover:bg-default",
                                {
                                  "data-[status='active']:bg-default": !!match,
                                },
                              )}
                            >
                              <item.icon className="size-5 text-muted" />
                              {item.label}
                            </Link>
                          </span>
                        )}
                      </MatchRoute>
                    )}
                  />
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export const selectedGlobalClinicAtom = createAtom<string | null>(null);

function SelectGlobalClinic() {
  const [selectedClinic, setSelectedClinic] = useAtom(selectedGlobalClinicAtom);
  const [error, setError] = useState("");
  const clinics = useQuery(orpc.listClinics.queryOptions());

  useEffect(() => {
    if (clinics.isError) {
      setError("Failed to populate clinics data.");
    }
  }, [clinics.isError]);

  if (!clinics.data) {
    return null;
  }

  const options = toComboBoxOptions(clinics.data, {
    labelKey: "name",
    valueKey: "id",
  });

  return (
    <AppComboBox
      value={selectedClinic}
      onChange={(v) => setSelectedClinic(v as any)}
      aria-label="select clinic"
      placeholder="Select Clinic"
      variant="secondary"
      options={options}
      isInvalid={!!error}
      error={error}
    />
  );
}
