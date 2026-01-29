/** biome-ignore-all lint/style/noNegationElse: <explanation> */
/** biome-ignore-all lint/style/noNestedTernary: <explanation> */
/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <explanation> */
import { type AnyFieldApi, useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/add')({
	component: RouteComponent,
})

function RouteComponent() {
	const form = useForm({
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
		},
		onSubmit: async ({ value }) => {
			const response = await fetch('https://dummyjson.com/users/add', {
				body: JSON.stringify({
					email: value.email,
					firstName: value.firstName,
					lastName: value.lastName,
				}),
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
			})
			const data = await response.json()
			console.log(data)
			// Optionally: gestion de feedback, reset, ou navigation
		},
	})

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}>
			<div>
				<form.Field
					name='firstName'
					validators={{
						onChange: ({ value }) =>
							!value
								? 'A first name is required'
								: value.length < 3
									? 'First name must be at least 3 characters'
									: undefined,
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
				<form.Field name='lastName'>
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
