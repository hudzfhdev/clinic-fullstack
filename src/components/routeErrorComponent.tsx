import { Alert, Button } from "@heroui/react";
import type { ErrorComponentProps } from "@tanstack/react-router";

export function RouteErrorComponent({ error, reset }: ErrorComponentProps) {
  let errMessage = "Something is wrong...";
  if (error) {
    if ("message" in error && typeof error.message === "string") {
      errMessage = error.message;
    }
  }

  return (
    <Alert status="danger">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Error</Alert.Title>
        <Alert.Description>{errMessage}</Alert.Description>
      </Alert.Content>
      <Button
        className="rounded-full"
        size="sm"
        variant="danger"
        onClick={() => reset()}
      >
        Retry
      </Button>
    </Alert>
  );
}
