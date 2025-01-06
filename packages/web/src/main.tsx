import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/dark-mode/theme-provider";
import { treatyClient } from "@committed/api/src/lib/eden";
import { NotFound } from "./components/error/not-found";
import { sessionStore } from "./lib/store";

export const api = treatyClient(import.meta.env.VITE_API_URL);
export type API = typeof api;
export const qc = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: "viewport",
  context: {
    qc: qc,
    api: api,
    sessionStore: sessionStore,
  },
  defaultNotFoundComponent: () => NotFound(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={qc}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
}
