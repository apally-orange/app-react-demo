import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: Index,
})

function Index() {
	return (
		<div>
			<h1>Dashboard</h1>
			<ul className='list'>
				<Link className='list-card' to='/posts/'>
					Posts
				</Link>
								<Link className='list-card' to='/products/'>
					Products
				</Link>
			</ul>
		</div>
	)
}
