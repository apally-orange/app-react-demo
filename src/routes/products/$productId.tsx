import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loading } from '../../core/components/Loading.tsx'

export const Route = createFileRoute('/products/$productId')({
	component: RouteComponent,
	loader: ({ context: { queryClient }, params: { productId } }) =>
		queryClient.ensureQueryData(productQueryOptions(productId)),
})

const productQueryOptions = (productId: string) =>
	queryOptions({
		queryFn: () =>
			fetch(`https://dummyjson.com/products/${productId}`).then((res) =>
				res.json(),
			),
		queryKey: ['products', productId],
	})

function RouteComponent() {
	const { productId } = Route.useParams()
	const { data, isLoading } = useSuspenseQuery(productQueryOptions(productId))

	if (isLoading) {
		return <Loading />
	}

	const {
		title,
		description,
		category,
		tags,
		price,
		discountPercentage,
		images,
		stock,
		brand,
	} = data

	return (
		<div className='product-details'>
			<div className='product-visuals'>
				{images?.[0] && (
					<img
						alt={title}
						className='product-main-img'
						height={300}
						src={images[0]}
						width={300}
					/>
				)}
			</div>
			<h2>{title}</h2>
			<p>
				<strong>Catégorie :</strong> {category} {brand ? ` | ${brand}` : ''}
			</p>
			<p>
				<strong>Prix :</strong> {price} €{' '}
				{discountPercentage && (
					<span style={{ color: '#b00', marginLeft: '1rem' }}>
						(-{discountPercentage}%)
					</span>
				)}
			</p>
			<p>
				<strong>Stock :</strong> {stock > 0 ? `${stock} dispo` : 'Rupture'}
			</p>
			<p>
				<strong>Description :</strong> {description}
			</p>
			{tags && (
				<div className='tags'>
					<strong>Tags :</strong>
					{tags.map((tag: string) => (
						<span className='tag' key={tag}>
							{tag}
						</span>
					))}
				</div>
			)}
			{images && images.length > 1 && (
				<div className='other-images'>
					<strong>Autres images :</strong>
					<div className='other-images-list'>
						{images.slice(1).map((img: string, idx: number) => (
							<img
								alt={`${title} (${idx + 2})`}
								height={300}
								key={img}
								src={img}
								width={300}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
