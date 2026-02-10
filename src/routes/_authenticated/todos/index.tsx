import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/todos/')({
	component: RouteComponent,
})

function RouteComponent() {
    const { auth } = Route.useRouteContext()
    
	return (<div>
        <p className="text-gray-600">
          Hello, <strong>{auth.user?.username}</strong>! You are successfully
          authenticated.
        </p>
    </div>)
}


