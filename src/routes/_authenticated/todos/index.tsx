import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/todos/')({
	component: RouteComponent,
	loader: ({ context: { queryClient, auth } }) =>
		queryClient.ensureQueryData(todosQueryOptions(auth.user?.id ?? '')),
})

const todosQueryOptions = (userId: string) =>
	queryOptions({
		queryFn: () => {
			const token = localStorage.getItem('auth-token')

			return fetch(`https://dummyjson.com/auth/users/${userId}/todos`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				method: 'GET',
			}).then((res) => res.json())
		},
		queryKey: ['todos'],
	})

function RouteComponent() {
	const { auth } = Route.useRouteContext()

	return (
		<div>
			<h1>
				Hello, <strong>{auth.user?.username}</strong>!
			</h1>
			<Todoslist />
		</div>
	)
}

type Todo = {
	id: string
	todo: string
	completed: boolean
	userId: string
}

function Todoslist() {
	const { auth } = Route.useRouteContext()
	const { data } = useSuspenseQuery(todosQueryOptions(auth.user.id))

	const todos = data.todos as Todo[]

	return (
		<ul>
			{todos.map((todo) => (
				<li
					key={todo.id}
					style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
					<span>{todo.completed ? '✅' : '⬜'}</span>
					<span>{todo.todo}</span>
				</li>
			))}
		</ul>
	)
}
	