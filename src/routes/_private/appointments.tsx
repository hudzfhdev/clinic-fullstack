import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/appointments"!</div>
}
