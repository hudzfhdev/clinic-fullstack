import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/(clinics)/clinics_/$id/rooms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/(clinics)/clinics_/$id/rooms"!</div>
}
