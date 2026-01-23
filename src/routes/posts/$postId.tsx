import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loading } from '../../core/components/loading.tsx'
import './Post.css'

export const Route = createFileRoute('/posts/$postId')({
	component: RouteComponent,
	loader: ({ context: { queryClient }, params: { postId } }) =>
		queryClient.ensureQueryData(postQueryOptions(postId)),
})

const postQueryOptions =  (postId: string) =>
	 queryOptions({
		queryFn: () =>
			fetch(`https://dummyjson.com/posts/${postId}`).then((res) => res.json()),
		queryKey: ['posts', postId],
	})


function RouteComponent() {
	const { postId } = Route.useParams()
	const { data, isLoading } = useSuspenseQuery(postQueryOptions(postId))

	if (isLoading) {
		return <Loading />
	}

	const { title, body, tags, reactions, views, userId } = data

	return (
        <div className="postWidget">
            <h2 className="title">{title}</h2>
            <p className="body">{body}</p>
            <div className="tags">
                <strong>Tags: </strong>
                {tags.map((tag: string) => (
                    <span className="tag" key={tag}>{tag}</span>
                ))}
            </div>
            <div className="reactions">
                <span>👍 <strong>{reactions.likes}</strong></span>
                <span>👎 <strong>{reactions.dislikes}</strong></span>
                <span>👁️ <strong>{views}</strong></span>
            </div>
            <div className="userId">
                Utilisateur : <strong>{userId}</strong>
            </div>
        </div>
    )
}
