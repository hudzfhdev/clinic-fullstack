import { AppPageLayout } from "#/components/appLayouts.tsx";
import { Card, Link } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { CircleDollarSignIcon } from "lucide-react";

export const Route = createFileRoute("/_private/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageLayout>
      <Card className="w-100">
        <CircleDollarSignIcon
          aria-label="Dollar sign icon"
          className="text-primary size-6"
          role="img"
        />
        <Card.Header>
          <Card.Title>Become an Acme Creator!</Card.Title>
          <Card.Description>
            Visit the Acme Creator Hub to sign up today and start earning
            credits from your fans and followers.
          </Card.Description>
        </Card.Header>
        <Card.Footer>
          <Link
            aria-label="Go to Acme Creator Hub (opens in new tab)"
            href="https://heroui.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Creator Hub
            <Link.Icon aria-hidden="true" />
          </Link>
        </Card.Footer>
      </Card>
    </AppPageLayout>
  );
}
