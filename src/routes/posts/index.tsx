import {
	infiniteQueryOptions,
	useSuspenseInfiniteQuery,
} from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ErrorCard } from '../../core/components/ErrorCard.tsx'
import { Loading } from '../../core/components/Loading.tsx'

export const Route = createFileRoute('/posts/')({
	component: RouteComponent,
	errorComponent: () => <ErrorCard />,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureInfiniteQueryData(postsQueryOptions),
})

type Post = {
	id: number
	title: string
}

type PostPage = {
	posts: Post[]
	total: number
	skip: number
	limit: number
}

// biome-ignore lint/correctness/noUnusedVariables: for help understand data
type PostsApiData = {
	pages: PostPage[]
	pageParams: number[]
}

const pageSize: number = 50

const postsQueryOptions = infiniteQueryOptions({
	getNextPageParam: (lastPage: PostPage, _, lastPageParam) => {
		const total = lastPage.total
		const nextPage = lastPageParam + 1

		if (total > nextPage * pageSize) {
			return nextPage
		}
		return undefined
	},
	initialPageParam: 0,
	queryFn: ({ pageParam }) => {
		const skip = pageSize * pageParam

		return fetch(
			`https://dummyjson.com/posts?&select=title&limit=${pageSize}&skip=${skip}`,
		).then((res) => res.json())
	},
	queryKey: ['posts'],
})

function RouteComponent() {
	const {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useSuspenseInfiniteQuery(postsQueryOptions)

	if (isLoading) {
		return <Loading />
	}

	if (!data) {
		return <ErrorCard />
	}

	const pages = data.pages
	const posts = pages.flatMap((page) => page.posts)

	let buttonText = 'Loading more...'
	if (!isFetchingNextPage && hasNextPage) {
		buttonText = 'Load More'
	} else if (!(isFetchingNextPage || hasNextPage)) {
		buttonText = 'Nothing more to load'
	}

	return (
		<>
			<h1>Liste des Posts</h1>
			<ul className='list'>
				{posts.map((post: Post) => (
					<Link
						className='list-card'
						key={post.id}
						params={{ postId: post.id }}
						to='/posts/$postId'>
						<span className='list-title'>{post.title}</span>
					</Link>
				))}
			</ul>
			<div>
				<button
					disabled={!hasNextPage || isFetching}
					onClick={() => fetchNextPage()}>
					{buttonText}
				</button>
			</div>
			<div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
		</>
	)
}
