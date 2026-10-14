import { navItems } from "#/components/appLayouts.tsx";
import { Button, buttonVariants, Separator, Tooltip } from "@heroui/react";
import {
  createFileRoute,
  Link,
  MatchRoute,
  Outlet,
} from "@tanstack/react-router";
import { createAtom, useSelector } from "@tanstack/react-store";
import { cn } from "cn";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
});

const sidebarAtom = createAtom<{ state: "expanded" | "collapsed" }>({
  state: "expanded",
});

const toggleSidebar = () => {
  sidebarAtom.set((prev) => ({
    ...prev,
    state: prev.state === "collapsed" ? "expanded" : "collapsed",
  }));
};

function RouteComponent() {
  const { state } = useSelector(sidebarAtom);

  return (
    <div className="flex h-full">
      <aside
        aria-label="main navigation"
        data-state={state}
        className={cn(
          "flex flex-col items-center bg-surface p-2 w-14 transition-[width] border-r border-r-separator",
          {
            "w-64 items-start": state === "expanded",
          },
        )}
      >
        {/** HEADER */}
        <div
          className={cn(
            "space-y-2 w-full flex items-end flex-col h-12",
            "data-[state='collapsed']:items-center",
          )}
        ></div>

        {/** NAV */}
        <div className="flex flex-col gap-1 w-full">
          {navItems.map((nav) => {
            if (state === "collapsed") {
              return (
                <Tooltip delay={0} key={nav.label}>
                  <Tooltip.Trigger>
                    <MatchRoute to={nav.to} fuzzy={false}>
                      {(match) => (
                        <Link
                          className={buttonVariants({
                            variant: match ? "tertiary" : "ghost",
                            isIconOnly: true,
                          })}
                          to={nav.to}
                          aria-label={nav.label}
                        >
                          <nav.icon />
                        </Link>
                      )}
                    </MatchRoute>
                  </Tooltip.Trigger>

                  <Tooltip.Content placement="right">
                    <Tooltip.Arrow />
                    {nav.label}
                  </Tooltip.Content>
                </Tooltip>
              );
            }

            return (
              <MatchRoute to={nav.to} fuzzy={false}>
                {(match) => (
                  <Link
                    className={buttonVariants({
                      variant: match ? "tertiary" : "ghost",
                      className: "w-full justify-start gap-3",
                    })}
                    to={nav.to}
                  >
                    <nav.icon />
                    <span>{nav.label}</span>
                  </Link>
                )}
              </MatchRoute>
            );
          })}
        </div>
      </aside>

      <main className="grow">
        <div className="h-14 bg-surface py-5 px-2 flex items-center border-b border-b-separator">
          <Button isIconOnly variant="ghost" onClick={toggleSidebar}>
            {state === "collapsed" ? (
              <PanelLeftOpenIcon />
            ) : (
              <PanelLeftCloseIcon />
            )}
          </Button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
