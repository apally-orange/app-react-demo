import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';


interface AuthState {
  isAuthenticated: boolean
  user: { id: string; username: string; email: string } | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export interface RouterContext {
	queryClient: QueryClient
	auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
	 component: () => (
    <div>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
})
