import {
  Outlet,
  createRootRouteWithContext,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import type { API } from "@/main";
import { sessionStore } from "@/lib/store";
import { getSession, useSession } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const Route = createRootRouteWithContext<{
  api: API;
  qc: QueryClient;
  sessionStore: typeof sessionStore;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-grow  w-full h-full flex items-center justify-center">
        <Outlet />
      </div>

      {import.meta.env.VITE_ENV === "development" && (
        <>
          <ReactQueryDevtools />
        </>
      )}

      <Footer />
    </div>
  );
}
