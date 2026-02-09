import { useStore } from '@tanstack/react-form'
import { useFieldContext } from '../hooks/form-context.tsx'

// biome-ignore lint/style/noDefaultExport: test
export default function TextField({ label }: { label: string }) {
	const field = useFieldContext<string>()

	const errors = useStore(field.store, (state) => state.meta.errors)

	return (
		<div>
			<label>
				<div>{label}</div>
				<input
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					value={field.state.value}
				/>
			</label>
			{errors.map((error: string) => (
				<div key={error} style={{ color: 'red' }}>
					{error}
				</div>
			))}
		</div>
	)
}
