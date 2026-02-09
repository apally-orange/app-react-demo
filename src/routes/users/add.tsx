import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useAppForm } from '../../core/hooks/form.tsx'
import { userFormOpts, userSchema } from '../../core/user-option.tsx'
import './add.css'

export const Route = createFileRoute('/users/add')({
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const addUserMutation = useMutation({
		mutationFn: async (userData) => {
			const response = await fetch('https://dummyjson.com/users/add', {
				body: JSON.stringify(userData),
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
			})
			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			return response.json()
		},
		onError: (error) => {
			console.error('Error adding user:', error)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
			form.reset()
			navigate({ to: '/users' })
		},
	})

	const form = useAppForm({
		...userFormOpts,
		onSubmit: ({ value }) => {
			const result = userSchema.safeParse(value)

			if (result.success) {
				addUserMutation.mutate(result.data)
			} else {
				console.error('Validation error:', result.error)
			}
		},
	})

	return (
		<form
			className='form'
			name='user'
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}>
			<form.AppField name='firstName'>
				{(field) => <field.TextField label='First Name' />}
			</form.AppField>
			<form.AppField name='lastName'>
				{(field) => <field.TextField label='Last Name' />}
			</form.AppField>
			<form.AppField name='email'>
				{(field) => <field.TextField label='Email' />}
			</form.AppField>
			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}>
				{([canSubmit, isSubmitting]) => (
					<div className='buttonContainer'>
						<button
							className='button submitButton'
							disabled={!canSubmit}
							type='submit'>
							{isSubmitting ? '...' : 'Submit'}
						</button>
						<button
							className='button resetButton'
							onClick={(e) => {
								// Avoid unexpected resets of form elements (especially <select> elements)
								e.preventDefault()
								form.reset()
							}}
							type='reset'>
							Reset
						</button>
					</div>
				)}
			</form.Subscribe>
		</form>
	)
}
