import { QueryClient } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import './App.css'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient()

const router = createRouter({
	context: {
		queryClient,
	},
	routeTree,
})

export function App() {
	return <RouterProvider router={router} />
}
