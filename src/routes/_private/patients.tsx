import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/patients"!</div>
}
