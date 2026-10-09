import type { InferClientOutputs } from "@orpc/client";
import type { client } from "./client";

export type OutputRouter = InferClientOutputs<typeof client>;
