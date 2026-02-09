import { formOptions } from '@tanstack/react-form'
import z from 'zod'

export const userSchema = z.object({
	email: z.email({
		message: 'Please enter a valid email address (e.g., user@example.com)',
	}),
	firstName: z
		.string()
		.min(3, { message: 'First name must be at least 3 characters' }),
	lastName: z.string().min(1, { message: 'Last name is required' }),
})

export const userFormOpts = formOptions({
	defaultValues: {
		email: '',
		firstName: '',
		lastName: '',
	},
	validators: {
		onChangeAsync: ({ value }) => {
			const errors = {
				fields: {},
			} as {
				fields: Record<string, string>
			}

			const result = userSchema.safeParse(value)

			if (!result.success) {
				for (const issue of result.error.issues) {
					errors.fields[issue.path[0]] = issue.message
				}
			}

			return errors
		},
	},
})
