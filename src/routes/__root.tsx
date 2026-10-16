import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { ToastProvider } from "@heroui/react";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Clinic" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent(props) {
    return (
      <div>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
    );
  },
});

const theme: "light" | "dark" = "light";

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme={theme} className={theme} lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        <ToastProvider placement="bottom end" />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
