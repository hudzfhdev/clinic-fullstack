import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/staffs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/staffs"!</div>
}
