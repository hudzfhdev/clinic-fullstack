import { Tooltip } from "@heroui/react";
import type { ReactNode } from "react";

export function AppTooltip({
  renderTrigger,
  renderContent,
  placement,
}: {
  placement?: Tooltip["ContentProps"]["placement"];
  renderTrigger: ReactNode;
  renderContent: ReactNode;
}) {
  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger>{renderTrigger}</Tooltip.Trigger>
      <Tooltip.Content className="break-normal" placement={placement}>
        <Tooltip.Arrow />
        {renderContent}
      </Tooltip.Content>
    </Tooltip>
  );
}
