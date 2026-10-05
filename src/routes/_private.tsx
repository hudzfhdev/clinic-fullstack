import {
  createFileRoute,
  Outlet,
  Link as TRRLink,
} from "@tanstack/react-router";
import { Drawer, Button, Link } from "@heroui/react";
import { HospitalIcon, HouseIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import type { ComponentType, PropsWithChildren, SVGProps } from "react";
import { cn } from "cn";

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
});

const navItems: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  to: string;
}[] = [
  { icon: HouseIcon, label: "Dashboard", to: "/" },
  { icon: HospitalIcon, label: "Clinics", to: "/clinics" },
];

function RouteComponent() {
  return (
    <>
      <header className="flex justify-between p-3 shadow-md">
        <Sidebar />
      </header>
      <Outlet />
    </>
  );
}

export function AppPageLayout({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return <main className={cn("p-6 w-full", className)}>{children}</main>;
}

function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer isOpen={open} onOpenChange={setOpen}>
      <Button size="sm" variant="ghost" isIconOnly>
        <MenuIcon />
      </Button>
      <Drawer.Backdrop variant="blur">
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    className="text rounded-xl w-full text-sm text-foreground transition-colors hover:bg-default"
                    onPress={() => setOpen(false)}
                  >
                    <TRRLink
                      to={item.to}
                      className="w-full px-3 py-2.5 flex items-center gap-3"
                    >
                      <item.icon className="size-5 text-muted" />
                      {item.label}
                    </TRRLink>
                  </Link>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
