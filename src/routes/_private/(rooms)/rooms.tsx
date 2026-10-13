import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(rooms)/rooms")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_private/(rooms)/rooms"!</div>;
}
