import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import {
	createFileRoute,
	Link,
	useNavigate,
	useSearch,
} from '@tanstack/react-router'
import { Loading } from '../../core/components/Loading.tsx'

export const Route = createFileRoute('/products/')({
	component: RouteComponent,
	loader: ({ context: { queryClient }, deps: search }) => {
		const searchText = search?.search ?? ''
		queryClient.fetchQuery(productsQueryOptions(searchText))
	},
	loaderDeps: ({ search }) => search,
})

const productsQueryOptions = (search: string) =>
	queryOptions({
		queryFn: () => {
			return fetch(
				`https://dummyjson.com/products/search?&select=title,price,thumbnail&q=${search}`,
			).then((res) => res.json())
		},
		queryKey: ['products'],
	})

type Product = {
	id: number
	title: string
	price: number
	thumbnail: string
}

function RouteComponent() {
	const { data, isLoading } = useSuspenseQuery(productsQueryOptions(''))

	if (isLoading) {
		return <Loading />
	}

	const products = data.products as Product[]

	return (
		<div>
			<h1>Produits</h1>
			<Search />
			<div className='list'>
				{products.map((p) => (
					<ProductCard key={p.id} product={p} />
				))}
			</div>
		</div>
	)
}

function Search() {
	const navigate = useNavigate({ from: '/products/' })
	const search = useSearch({ from: '/products/' }) as { search?: string }

	const searchValue = search?.search ?? ''

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		navigate({
			search: () => ({ search: e.target.value }),
			to: '/products/',
		})
	}

	return (
		<input
			className='search-bar'
			onChange={handleSearch}
			placeholder='Rechercher...'
			style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
			type='search'
			value={searchValue}
		/>
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
