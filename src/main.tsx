import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './main.css'

// biome-ignore lint/style/noNonNullAssertion: need for init App
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
		<TanStackDevtools plugins={[formDevtoolsPlugin()]} />
	</StrictMode>,
)
