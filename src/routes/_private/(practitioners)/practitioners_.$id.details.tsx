import { AppPageLayout } from "#/components/appLayouts.tsx";
import { orpc } from "#/orpc/client.ts";
import { Surface } from "@heroui/react";
import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_private/(practitioners)/practitioners_/$id/details",
)({
  component: RouteComponent,
  loader: (loaderProps) =>
    loaderProps.context.queryClient.query(
      orpc.getPractitionerByID.queryOptions({
        input: { id: loaderProps.params.id },
      }),
    ),
});

function RouteComponent() {
  const clinic = useLoaderData({
    from: "/_private/(practitioners)/practitioners_/$id/details",
    strict: true,
  });

  return (
    <AppPageLayout>
      <Surface className="p-5">
        <Link to="/practitioners">Practitioners list</Link>
        <pre>{JSON.stringify(clinic, null, 2)}</pre>
      </Surface>
    </AppPageLayout>
  );
}
