import { EmptyState } from "@heroui/react";
import { DatabaseIcon } from "lucide-react";

export const EmptyTable = () => {
  return (
    <EmptyState className="bg-surface flex min-h-50 w-full flex-col items-center justify-center gap-4 text-center">
      <DatabaseIcon className="size-6 text-muted" />
      <span className="text-sm text-muted">No results found</span>
    </EmptyState>
  );
};
