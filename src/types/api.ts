import type { client } from "#/orpc/client.ts";
import type { InferClientErrors } from "@orpc/client";

export type ClientErrors = InferClientErrors<typeof client>;
