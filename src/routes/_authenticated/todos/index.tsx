import {
    queryOptions,
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

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

    const [localTodos, setLocalTodos] = useState(data.todos as Todo[])

	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (todo: Todo) => {
			const token = localStorage.getItem('auth-token')
			const res = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
				body: JSON.stringify({ completed: !todo.completed }),
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				method: 'PUT',
			})

            //update local to simulate the respons update
            setLocalTodos(todos =>
            todos.map(t =>
                t.id === todo.id ? { ...t, completed: !t.completed } : t
            )
        )

			return res.json()
		},
		onSuccess: () => {
			// Invalide et refetch la liste des todos
			queryClient.invalidateQueries({ queryKey: ['todos'] })
		},
	})

	

	return (
		<ul>
			{localTodos.map((todo) => (
				<li
					key={todo.id}
					style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
					<button
						aria-label={
							todo.completed
								? 'Marquer comme non terminé'
								: 'Marquer comme terminé'
						}
						disabled={mutation.isPending}
						onClick={() => mutation.mutate(todo)}
						style={{
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							fontSize: 20,
						}}>
						{todo.completed ? '✅' : '⬜'}
					</button>
					<span>{todo.todo}</span>
				</li>
			))}
		</ul>
	)
}
						