import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/patients_/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/patients_/new"!</div>
}
