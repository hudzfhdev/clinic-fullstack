import { AppPageLayout } from "#/components/appLayouts.tsx";
import { RouteErrorComponent } from "#/components/routeErrorComponent";
import { orpc } from "#/orpc/client";
import { Alert, Button, Spinner, Surface } from "@heroui/react";
import {
  createFileRoute,
  ErrorComponent,
  useLoaderData,
} from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute(
  "/_private/(clinics)/clinics_/$id/details",
)({
  component: RouteComponent,
  params: {
    parse: z.object({ id: z.uuid() }).parse,
  },
  loader: ({ context, params }) =>
    context.queryClient.query(
      orpc.getClinicByID.queryOptions({ input: { clinic_id: params.id } }),
    ),
  pendingComponent: () => <Spinner />,
  errorComponent: ({ error, reset }) => {
    return (
      <AppPageLayout>
        <RouteErrorComponent error={error} reset={reset} />
      </AppPageLayout>
    );
  },
});

function RouteComponent() {
  const clinic = useLoaderData({
    from: "/_private/(clinics)/clinics_/$id/details",
    strict: true,
  });
  return (
    <Surface className="p-5">
      <pre>{JSON.stringify(clinic, null, 2)}</pre>
    </Surface>
  );
}
