import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private/(clinics)/clinics_/$id/services',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/(clinics)/clinics_/$id/services"!</div>
}
