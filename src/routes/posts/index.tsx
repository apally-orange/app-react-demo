import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ErrorCard } from '../../core/components/ErrorCard.tsx'
import { Loading } from '../../core/components/loading.tsx'

export const Route = createFileRoute('/posts/')({
	component: Posts,
})

type Post = {
	id: number
	title: string
}

function Posts() {
	const { data, isLoading, error } = useQuery<{ posts: Post[] }>({
		queryFn: () =>
			fetch('https://dummyjson.com/posts').then((res) => res.json()),
		queryKey: ['posts'],
	})

	if (isLoading) {
		return <Loading />
	}
	if (error) {
		return <ErrorCard />
	}

	return (
		<>
			<h1>Liste des Posts</h1>
			<ul className='list'>
				{data?.posts.map((post) => (
					<li className='list-card' key={post.id}>
						<span className='list-title'>{post.title}</span>
					</li>
				))}
			</ul>
		</>
	)
}
