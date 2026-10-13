import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(services)/services")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_private/(services)/services"!</div>;
}
