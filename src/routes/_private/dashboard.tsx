import { createFileRoute } from '@tanstack/react-router'
import { AppPageLayout } from '../_private'

export const Route = createFileRoute('/_private/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AppPageLayout>Hello "/_private/dashboard"!</AppPageLayout>
}
