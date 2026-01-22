import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ErrorCard } from '../../core/components/ErrorCard.tsx'
import { Loading } from '../../core/components/loading.tsx'

export const Route = createFileRoute('/posts/')({
	component: RouteComponent,
	errorComponent: () => <ErrorCard />,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(postsQueryOptions),
})

type Post = {
	id: number
	title: string
}

const postsQueryOptions = queryOptions({
	queryFn: () => fetch('https://dummyjson.com/posts').then((res) => res.json()),
	queryKey: ['posts'],
})

function RouteComponent() {
	const { data, isLoading } = useSuspenseQuery(postsQueryOptions)

	if (isLoading) {
		return <Loading />
	}

	return (
		<>
			<h1>Liste des Posts</h1>
			<ul className='list'>
				{data?.posts.map((post: Post) => (
					<Link
						className='list-card'
						key={post.id}
						params={{ postId: post.id }}
						to='/posts/$postId'>
						<span className='list-title'>{post.title}</span>
					</Link>
				))}
			</ul>
		</>
	)
}
