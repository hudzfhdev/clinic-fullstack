import { AppPageLayout } from "#/components/appLayouts.tsx";
import { Alert, Card, Link } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { CircleDollarSignIcon } from "lucide-react";

export const Route = createFileRoute("/_private/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageLayout className="space-y-5">
      <Alert status="warning">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Scheduled maintenance</Alert.Title>
          <Alert.Description>
            Our services will be unavailable on Sunday, March 15th from 2:00 AM
            to 6:00 AM UTC for scheduled maintenance.
          </Alert.Description>
        </Alert.Content>
      </Alert>
      <div className="flex gap-4">
        {new Array(3).fill(null).map((_, index) => {
          return (
            <Card key={index}>
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
          );
        })}
      </div>
    </AppPageLayout>
  );
}
