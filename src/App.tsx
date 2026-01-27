import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import './App.css'
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
		queryClient,
	},
	routeTree,
})

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
