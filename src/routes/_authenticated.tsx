import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: ({ context, location }) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				search: {
					// Save current location for redirect after login
					redirect: location.href,
				},
				to: '/login',
			})
		}
	},
	component: () => <Outlet />,
})



