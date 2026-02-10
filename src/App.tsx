import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import './App.css'
import { AuthProvider, useAuth } from './routes/auth.tsx'
import { routeTree } from './routeTree.gen.ts'

const queryClient = new QueryClient()

declare global {
	interface Window {
		__TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient
	}
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient

const router = createRouter({
	context: {
		// biome-ignore lint/style/noNonNullAssertion: spécial initialisation
		auth: undefined!,
		queryClient,
	},
	routeTree,
})

function InnerApp() {
	const auth = useAuth()
	return <RouterProvider context={{ auth }} router={router} />
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<InnerApp />
			</AuthProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
