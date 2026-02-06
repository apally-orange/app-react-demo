/** biome-ignore-all lint/style/noNegationElse: <explanation> */
/** biome-ignore-all lint/style/noNestedTernary: <explanation> */
/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <explanation> */
import { type AnyFieldApi, useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const userSchema = z.object({
	email: z.email('Invalid email address'),
	firstName: z.string().min(3, 'First name must be at least 3 characters'),
	lastName: z.string().min(1, 'Last name is required'),
})

export const Route = createFileRoute('/users/add')({
	component: RouteComponent,
})

function RouteComponent() {
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
		},
	})

	const form = useForm({
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
		},
		onSubmit: async ({ value }) => {
			try {
				const validatedData = userSchema.parse(value)
				addUserMutation.mutate(validatedData)
			} catch (error) {
				console.error('Validation error:', error)
			}
		},
	})
	return (
		<form
			name='user'
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}>
			<div>
				<form.Field
					name='firstName'
					validators={{
						onChange: ({ value }) => {
							try {
								userSchema.shape.firstName.parse(value)
								return undefined
							} catch (error) {
								return error.message
							}
						},
						onChangeAsync: async ({ value }) => {
							await new Promise((resolve) => setTimeout(resolve, 1000))
							return (
								value.includes('error') && 'No "error" allowed in first name'
							)
						},
						onChangeAsyncDebounceMs: 500,
					}}>
					{(field) => {
						// Avoid hasty abstractions. Render props are great!
						return (
							<>
								<label htmlFor={field.name}>First Name:</label>
								<input
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									value={field.state.value}
								/>
								<FieldInfo field={field} />
							</>
						)
					}}
				</form.Field>
			</div>
			<div>
				<form.Field
					name='lastName'
					validators={{
						onChange: ({ value }) => {
							try {
								userSchema.shape.lastName.parse(value)
								return undefined
							} catch (error) {
								return error.message
							}
						},
					}}>
					{(field) => (
						<>
							<label htmlFor={field.name}>Last Name:</label>
							<input
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								value={field.state.value}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</form.Field>
			</div>
			<div>
				<form.Field
					name='email'
					validators={{
						onChange: ({ value }) => {
							try {
								userSchema.shape.email.parse(value)
								return undefined
							} catch (error) {
								return error.message
							}
						},
					}}>
					{(field) => (
						<>
							<label htmlFor={field.name}>Email:</label>
							<input
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								value={field.state.value}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</form.Field>
			</div>
			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}>
				{([canSubmit, isSubmitting]) => (
					<>
						<button disabled={!canSubmit} type='submit'>
							{isSubmitting ? '...' : 'Submit'}
						</button>
						<button
							onClick={(e) => {
								// Avoid unexpected resets of form elements (especially <select> elements)
								e.preventDefault()
								form.reset()
							}}
							type='reset'>
							Reset
						</button>
					</>
				)}
			</form.Subscribe>
		</form>
	)
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<>
			{field.state.meta.isTouched && !field.state.meta.isValid ? (
				<em>{field.state.meta.errors.join(',')}</em>
			) : null}
			{field.state.meta.isValidating ? 'Validating...' : null}
		</>
	)
}
