import { AppPageLayout } from "#/components/appLayouts.tsx";
import { EntityIcon } from "#/components/entityIcons.tsx";
import { RouteErrorComponent } from "#/components/routeErrorComponent.tsx";
import { orpc } from "#/orpc/client.ts";
import { Spinner, Surface, Tabs, Tooltip, Typography } from "@heroui/react";
import {
  createFileRoute,
  Link,
  MatchRoute,
  Outlet,
  useLoaderData,
  useMatchRoute,
  useParams,
} from "@tanstack/react-router";
import { cn } from "cn";
import { CircleCheckIcon } from "lucide-react";

export const Route = createFileRoute("/_private/(clinics)/clinics_/$id")({
  component: RouteComponent,
  errorComponent: (props) => (
    <AppPageLayout>
      <RouteErrorComponent {...props} />
    </AppPageLayout>
  ),
  loader: ({ context, params }) =>
    context.queryClient.query(
      orpc.getClinicByID.queryOptions({ input: { clinic_id: params.id } }),
    ),
  pendingComponent: () => <Spinner />,
});

function RouteComponent() {
  const clinicData = useLoaderData({
    from: "/_private/(clinics)/clinics_/$id",
    strict: true,
  });
  const params = useParams({
    from: "/_private/(clinics)/clinics_/$id",
    strict: true,
  });

  const match = useMatchRoute();
  const isDetailsPage = match({ from: "/clinics/$id/details" });
  const isRoomsPage = match({ from: "/clinics/$id/rooms" });
  const isServicesPage = match({ from: "/clinics/$id/services" });

  let currentTab = "";
  if (isDetailsPage) currentTab = "details";
  else if (isRoomsPage) currentTab = "rooms";
  else if (isServicesPage) currentTab = "services";

  return (
    <AppPageLayout className="flex flex-col gap-4">
      <div className="flex gap-3 items-baseline">
        <div className="flex gap-2">
          <EntityIcon entity="clinics" />
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <CircleCheckIcon className={"text-success fill-success-soft"} />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Arrow />
              <Typography type="body-sm">
                This clinic is active in the system.
              </Typography>
            </Tooltip.Content>
          </Tooltip>
        </div>
        <Typography type="h2">{clinicData.name}</Typography>
      </div>

      <div>
        <Link to="/clinics">Clinics list</Link>
      </div>

      <Tabs selectedKey={currentTab} variant="primary">
        <Tabs.ListContainer className="w-fit">
          <Tabs.List aria-label="clinics tabs" className="gap-2">
            <MatchRoute to="/clinics/$id/details" params={params}>
              {(m) => (
                <Tabs.Tab
                  id="details"
                  className={cn("w-32 p-0", {
                    "bg-surface": !!m,
                  })}
                >
                  <Link
                    className="w-full h-full flex justify-center items-center"
                    to="/clinics/$id/details"
                    params={params}
                  >
                    Details
                  </Link>
                </Tabs.Tab>
              )}
            </MatchRoute>
            <MatchRoute to="/clinics/$id/rooms" params={params}>
              {(m) => (
                <Tabs.Tab
                  id="rooms"
                  className={cn("w-32 p-0", { "bg-surface": !!m })}
                >
                  <Link
                    className="w-full h-full flex justify-center items-center"
                    to="/clinics/$id/rooms"
                    params={params}
                  >
                    Rooms
                  </Link>
                </Tabs.Tab>
              )}
            </MatchRoute>
            <MatchRoute to="/clinics/$id/services" params={params}>
              {(m) => (
                <Tabs.Tab
                  id="services"
                  className={cn("w-32 p-0", { "bg-surface": !!m })}
                >
                  <Link
                    className="w-full h-full flex justify-center items-center"
                    to="/clinics/$id/services"
                    params={params}
                  >
                    Services
                  </Link>
                </Tabs.Tab>
              )}
            </MatchRoute>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="px-0" id={currentTab}>
          <Surface className="p-5 shadow-xl">
            <Outlet />
          </Surface>
        </Tabs.Panel>
      </Tabs>
    </AppPageLayout>
  );
}
