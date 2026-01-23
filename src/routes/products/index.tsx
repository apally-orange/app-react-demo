import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Loading } from '../../core/components/Loading.tsx'

export const Route = createFileRoute('/products/')({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) =>
		queryClient.fetchQuery(productsQueryOptions),
})

const productsQueryOptions = queryOptions({
	queryFn: () =>
		fetch('https://dummyjson.com/products?&select=title,price,thumbnail').then((res) => res.json()),
	queryKey: ['products'],
})

type Product = {
	id: number
	title: string
	price: number
	thumbnail: string
}

function RouteComponent() {
	const { data, isLoading } = useSuspenseQuery(productsQueryOptions)

	if (isLoading) {
		return <Loading />
	}

	const products = data.products as Product[]

	return (
		<div>
			<h1>Produits</h1>
			<div className='list'>
				{products.map((p) => (
					<ProductCard key={p.id} product={p} />
				))}
			</div>
		</div>
	)
}

function ProductCard({ product }: { product: Product }) {
	return (
		<Link
			className='list-card'
			key={product.id}
			params={{ productId: product.id }}
			to='/products/$productId'>
			<img
				alt={product.title}
				className='product-thumb'
				height='100'
				src={product.thumbnail}
				width='100'
			/>
			<h3>{product.title}</h3>
			<p className='product-price'>{product.price} €</p>
		</Link>
	)
}
