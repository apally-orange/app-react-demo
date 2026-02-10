import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
	beforeLoad: ({ context, search }) => {
		// Redirect if already authenticated
		if (context.auth.isAuthenticated) {
			throw redirect({ to: search.redirect })
		}
	},
	component: RouteComponent,
	validateSearch: (search) => ({
		redirect: (search.redirect as string) || '/',
	}),
})

function RouteComponent() {
	const { auth } = Route.useRouteContext()
	const { redirect } = Route.useSearch()
	const navigate = Route.useNavigate()
	const [username, setUsername] = useState('emilys')
	const [password, setPassword] = useState('emilyspass')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			await auth.login(username, password)
			// Navigate to the redirect URL using router navigation
			navigate({ to: redirect })
		} catch (_) {
			setError('Invalid username or password')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<form
				className='max-w-md w-full space-y-4 p-6 border rounded-lg'
				onSubmit={handleSubmit}>
				<h1 className='text-2xl font-bold text-center'>Sign In</h1>

				{error && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
						{error}
					</div>
				)}

				<div>
					<label className='block text-sm font-medium mb-1' htmlFor='username'>
						Username
					</label>
					<input
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						id='username'
						onChange={(e) => setUsername(e.target.value)}
						required={true}
						type='text'
						value={username}
					/>
				</div>

				<div>
					<label className='block text-sm font-medium mb-1' htmlFor='password'>
						Password
					</label>
					<input
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						id='password'
						onChange={(e) => setPassword(e.target.value)}
						required={true}
						type='password'
						value={password}
					/>
				</div>

				<button
					className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
					disabled={isLoading}
					type='submit'>
					{isLoading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>
		</div>
	)
}
